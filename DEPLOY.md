# Despliegue de SonrisaPost

Guía para poner SonrisaPost en producción sobre un VPS con Coolify.

Está escrita para un servidor que **ya corre otra aplicación**. Varias
decisiones existen para que este despliegue no pueda tumbar a la otra.

---

## 1. Arquitectura

Tres procesos, una imagen:

| Servicio | Qué hace | Si se cae |
|---|---|---|
| `frontend` | Next.js: landing y aplicación | Nadie entra, pero los posts programados igual salen |
| `backend` | API NestJS | La app no responde |
| `orchestrator` | Workers de Temporal | **Los posts dejan de publicarse** |

Se construyen juntos porque comparten el árbol de dependencias, pero corren
separados: **se escala el que satura, y la caída de uno no arrastra a los
otros**.

El `orchestrator` es el que de verdad importa vigilar. Un frontend caído es
visible al instante; un orchestrator caído es silencioso — la app se ve
perfecta y los posts simplemente no salen.

Dependencias: PostgreSQL, Redis, Temporal y su propio Postgres.

### Por qué no hay Elasticsearch

Temporal lo usa para búsqueda avanzada de workflows. Con Postgres como
backend de visibilidad funciona igual a esta escala, y se ahorran **~1.2 GB de
RAM** más el servicio que más castiga el disco. Si algún día necesitás buscar
workflows por atributos personalizados, se agrega.

---

## 2. Antes de empezar

- [ ] Dominio con DNS en Cloudflare
- [ ] Un registro **A** de `sonrisapost.com` al IP del VPS, **con el proxy en
      gris** (ver §5)
- [ ] Bucket de Cloudflare R2 para media y backups
- [ ] Cuenta de Resend para email

---

## 3. Variables de entorno

Se cargan en el panel de Coolify. **Nunca en el repositorio.**

### Obligatorias

| Variable | Notas |
|---|---|
| `DATABASE_URL` | `postgresql://usuario:clave@postgres:5432/sonrisapost` |
| `REDIS_URL` | `redis://redis:6379` |
| `JWT_SECRET` | 64 caracteres aleatorios. Generar con `openssl rand -base64 48` |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Los usa el contenedor de Postgres |
| `TEMPORAL_DB_PASSWORD` | Base de Temporal |
| `TEMPORAL_ADDRESS` | `temporal:7233` |
| `FRONTEND_URL` | `https://sonrisapost.com` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://api.sonrisapost.com` |
| `BACKEND_INTERNAL_URL` | `http://backend:3000` |
| `MAIN_URL` | `https://sonrisapost.com` |
| `IS_GENERAL` | `true` |

**Rotar `JWT_SECRET` cierra todas las sesiones abiertas.** No es un problema,
pero conviene saberlo antes de hacerlo un martes a la mañana.

### Obligatoria por licencia

| Variable | Notas |
|---|---|
| `NEXT_PUBLIC_SOURCE_CODE_URL` | URL pública del código exacto que estás corriendo. Lo exige el §13 de la AGPL. Ver `NOTICE.md`. |

### Email — sin esto no hay recuperación de contraseña

| Variable | Notas |
|---|---|
| `EMAIL_PROVIDER` | `resend` |
| `RESEND_API_KEY` | |
| `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME` | |

Si no configurás un proveedor, el endpoint de "olvidé mi contraseña" responde
OK y **el mail nunca llega**. Quien pierda la clave queda afuera para siempre.

### Almacenamiento — obligatorio en producción

| Variable | Notas |
|---|---|
| `STORAGE_PROVIDER` | `cloudflare` |
| `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ACCESS_KEY`, `CLOUDFLARE_SECRET_ACCESS_KEY` | |
| `CLOUDFLARE_BUCKETNAME`, `CLOUDFLARE_BUCKET_URL`, `CLOUDFLARE_REGION` | `auto` |

**No uses `local`.** Las imágenes de los consultorios crecen rápido, llenan el
disco del VPS y se llevan puesta también a la otra aplicación.

### Opcionales

`SENTRY_AUTH_TOKEN` activa los sourcemaps de producción. Sin él no se generan
—a propósito—: sin Sentry a dónde subirlos, sólo agregan gigabytes a la imagen.

`NEXT_PUBLIC_PARENT_BRAND_URL` apunta el banner y la firma a DentalCore.

---

## 4. Primer despliegue

```bash
# 1. Construir y publicar la imagen
docker build -t ghcr.io/alfredoditullio/sonrisapost:v1 .
docker push ghcr.io/alfredoditullio/sonrisapost:v1

# 2. En Coolify: nuevo recurso -> Docker Compose -> pegar docker-compose.prod.yaml
#    Cargar las variables. Desplegar.

# 3. Crear el esquema (SOLO la primera vez)
docker compose -f docker-compose.prod.yaml exec backend \
  pnpm dlx prisma@6.5.0 db push \
  --schema ./libraries/nestjs-libraries/src/database/prisma/schema.prisma
```

En Coolify, rutear los dominios: `sonrisapost.com` → `frontend:4200`, y
`api.sonrisapost.com` → `backend:3000`.

Ambos deben estar bajo el mismo dominio raíz: la cookie de sesión se emite
sobre `.sonrisapost.com` para que el frontend y la API la compartan.

### Verificación

```bash
docker compose -f docker-compose.prod.yaml ps
```

Los tres servicios deben figurar `healthy`, no sólo `running`. El del
orchestrator comprueba la conexión real con Temporal — si pasa, los posts
programados van a salir.

---

## 5. Cloudflare y los certificados

Coolify emite el certificado con Let's Encrypt validando por HTTP. **Con el
proxy naranja activado, esa validación falla.**

Orden correcto:

1. DNS en **gris** (sólo DNS)
2. Desplegar y esperar el certificado
3. Recién ahí, **naranja** si querés CDN
4. Modo SSL/TLS en **Full (strict)** — nunca en Flexible, que deja el tramo
   entre Cloudflare y tu servidor sin cifrar

---

## 6. Backups

`var/docker/backup.sh` hace `pg_dump` y lo sube a R2.

```bash
# Prueba manual
docker compose -f docker-compose.prod.yaml exec postgres backup.sh
```

Diario a las 3 AM, desde el cron del host:

```
0 3 * * * cd /ruta/al/proyecto && docker compose -f docker-compose.prod.yaml exec -T postgres backup.sh >> /var/log/sonrisapost-backup.log 2>&1
```

Variables: `S3_BUCKET`, `S3_ENDPOINT` (el de R2),
`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `BACKUP_RETENTION_DAYS`.

**Restaurá un backup antes de necesitarlo.** Un backup que nunca se probó es
una hipótesis, no un respaldo:

```bash
docker compose -f docker-compose.prod.yaml exec -T postgres \
  pg_restore -U USUARIO -d BASE --clean < backup.dump
```

---

## 7. Escalar

El primer límite que vas a tocar es la memoria, no la CPU.

**Más tráfico web** → subir réplicas del frontend:

```bash
docker compose -f docker-compose.prod.yaml up -d --scale frontend=3
```

**Más volumen de publicaciones** → réplicas del orchestrator. Temporal reparte
el trabajo entre los workers de la misma cola, así que escala horizontalmente
sin configuración extra.

**Postgres** es lo último que se escala y lo más caro de mover. Antes de eso,
revisar índices y consultas.

Los `mem_limit` del compose están calculados para convivir con otra aplicación
en un VPS de 8 GB. Si le dedicás el servidor entero, subilos.

---

## 8. Qué monitorear

En orden de importancia:

1. **`orchestrator` sano.** Es la única falla silenciosa del sistema.
2. **Disco.** Con media en R2 crece despacio, pero los logs de un contenedor en
   bucle lo llenan en horas. Por eso hay rotación configurada.
3. **Memoria del host.** Si baja de 1 GB libre, aparece el OOM killer.
4. **Que el backup de anoche exista y pese lo esperado.**

---

## 9. Actualizar desde upstream

```bash
git fetch upstream
git merge upstream/main
```

Los conflictos van a estar casi siempre en textos de marca. Después de
resolver, **actualizá la lista de modificaciones de `NOTICE.md`**: la AGPL
exige que sea veraz.
