# Cosas para hacer

Pendientes de SonrisaPost. Lo que tiene que hacer Alfredo está marcado con 👤
(son cosas que requieren tus claves, tu tarjeta o tu decisión, y que yo no
puedo hacer por vos).

Última actualización: 19 de agosto de 2026

---

## ✅ Subida de imágenes — resuelto, falta confirmar

- [x] ~~Credenciales de R2.~~ A la Access Key ID le faltaba un carácter (31 en
      vez de 32). Se generó un token nuevo.
- [x] ~~Política de CORS en el bucket.~~ Cargada el 19/8. El navegador sube
      las partes **directo a Cloudflare**, no al servidor: sin esa política R2
      respondía 403 al preflight.
- [ ] **Confirmar subiendo una imagen de verdad**, en producción y en local.
      Es lo único que lo da por cerrado. Si vuelve a fallar, el error va a ser
      distinto y ya estaríamos en el último tramo.

---

## 🔴 Urgente — antes de encender la IA

El agente y la generación de imágenes cuestan plata **de tu bolsillo** en cada
uso. El código ya mide el consumo y le pone tope al agente, pero falta esto:

- [ ] 👤 **Poner límite de gasto mensual en el panel de OpenAI.**
      Es la única red de seguridad que no depende de que el código esté bien.
      Hacelo aunque no cargues la clave todavía.
      → platform.openai.com → Settings → Limits → Usage limits

- [ ] 👤 **Copiar los precios reales al `.env`.**
      Vienen vacías a propósito: un precio inventado da una ganancia falsa,
      que es peor que no tener ninguna. Sacalos del panel de OpenAI.

      ```
      AI_PRICE_INPUT_PER_MTOK=""   # dólares por millón de tokens de entrada
      AI_PRICE_OUTPUT_PER_MTOK=""  # dólares por millón de tokens de salida
      AI_PRICE_IMAGE=""            # dólares por imagen generada
      ```

      Sin esto se sigue midiendo igual (tokens e imágenes quedan guardados) y
      el costo figura en cero. Como las unidades quedan en la base, el día que
      los cargues se puede recalcular todo el histórico.

- [ ] 👤 **Cargar `OPENAI_API_KEY` en el `.env` local** (no en producción
      todavía) y usar el agente unas 20 veces vos mismo.

- [ ] **Mirar los números reales** y recién ahí definir cuánto vale un crédito.
      Lo importante no es el promedio sino el percentil 95 y si aparecen
      conversaciones con `hitLimit` (querría decir que el tope de 12 pasos
      quedó corto).

> ⚠️ **No cargar `OPENAI_API_KEY` en producción todavía.** El sistema de planes
> está desactivado porque no hay Stripe configurado, así que hoy cada usuario
> registrado tendría agente e imágenes **sin límite**, contra tu tarjeta.
> Primero hay que construir el contador de cupos.

---

## 🔐 Seguridad — rotar credenciales

Todas estas pasaron por el chat en algún momento y quedaron en el registro de
la conversación. Ninguna está comprometida que se sepa, pero rotarlas es
barato y no hacerlo es una deuda que crece.

- [ ] 👤 Contraseña de root del servidor Contabo
- [ ] 👤 Claves de acceso de Cloudflare R2 (Access Key ID + Secret)
- [ ] 👤 API key de Resend — **incluida la que quedó comentada en el `.env`**,
      que se imprimió completa al listar variables
- [ ] 👤 Client secret de Google OAuth

---

## 🚀 Despliegue

- [ ] **Verificar que v1.8.0 quedó bien.** Entrar a Configuración en
      sonrisapost.com y confirmar que dice "Notificaciones por correo" y
      "Formato de hora" (no el inglés de antes).

- [x] ~~**Arreglo del Dockerfile.**~~ Hecho el 19/8. Se agregó una etapa
      `deps` que arma `node_modules` sólo desde los manifiestos, con las
      fechas de modificación aplanadas. Verificado corriendo la imagen: el
      frontend sirve 200, el backend carga todo y el orchestrator se conecta
      a Temporal.

      > El **primer** despliegue con este cambio va a ser lento igual, porque
      > al reorganizar las capas cambian todos los digests. La mejora se ve
      > en el segundo. No es que falló.

- [ ] **Desplegar.** Hay **nueve commits** después de v1.8.0 sin publicar:
      editor de diseño, respuestas automáticas a comentarios con sus dos
      frenos, variación real en analíticas, medición de IA, Integraciones
      escondida y el arreglo del Dockerfile.

      Producción sigue en v1.8.0, que sólo tiene las traducciones.

---

## 📱 Aprobación de Meta

Sin esto no se puede publicar en Instagram ni Facebook, que es el 90% de lo
que van a querer los consultorios.

- [ ] 👤 Crear la app en developers.facebook.com
- [ ] 👤 Cargar `FACEBOOK_APP_ID` y `FACEBOOK_APP_SECRET` en el `.env` del
      servidor
- [ ] 👤 Conectar una cuenta de Instagram de prueba
- [ ] 👤 Grabar el video de demostración que pide Meta
- [ ] 👤 Enviar la solicitud con los permisos

---

## ⚖️ Legal

- [ ] 👤 **Que un abogado revise las páginas legales** antes del lanzamiento
      real. Las escribí yo y sirven para pasar la revisión de Meta, pero no
      son asesoramiento legal.

---

## 🧪 Nunca se probó

- [ ] **El editor de diseño, en el navegador.** Compila y el build de
      producción pasa, pero nadie arrastró un texto todavía. Lo más
      importante a mirar es **"Usar diseño"**: que el PNG salga a 1080 y no
      achicado al tamaño de la pantalla.


- [ ] **Publicar de verdad en una red social, de punta a punta.** Programar un
      post y ver que salga. Es la función principal del producto y todavía no
      la vimos funcionar ni una vez.

---

## 🤔 Decisiones pendientes

- [ ] 👤 **Cómo va a ser la prueba gratis.** Si ofrecés prueba, la prueba es el
      gasto — no hay forma de que sea cero.
      - Video de demostración (cuesta cero, y para dentistas convence casi
        igual que probarlo) ← mi recomendación para arrancar
      - Una imagen y una conversación por cuenta, una sola vez, con correo
        verificado obligatorio
      - Prueba habilitada a mano por vos

- [ ] 👤 **Pasarela de pagos.** Stripe **no acepta empresas argentinas**.
      - MercadoPago: lo mejor para dentistas argentinos (pagan en pesos con lo
        que ya usan), pero hay que construirlo — no existe nada en el código
      - Merchant of record (Paddle, Lemon Squeezy, Polar): aceptan vendedores
        desde Argentina, se encargan de impuestos, comisión más alta
      - Sociedad en EE.UU.: habilita Stripe, implica contador allá

      Verificá disponibilidad actual en la web de cada uno: cambia seguido.

- [ ] **Esconder el menú "Agente" mientras no haya clave configurada.** Hoy
      aparece siempre; si alguien hace clic, escribe y no pasa nada.

---

## 📌 Cosas que hay que recordar

Nada para hacer acá — son trampas conocidas, para no volver a perder horas.

**Coolify deja los contenedores en `Created`.** Hay que arrancarlos a mano en
orden de dependencias:

```bash
docker start postgres-<id> redis-<id> temporal-elasticsearch-<id> temporal-<id> backend-<id> orchestrator-<id> frontend-<id>
```

**Coolify sólo escribe el `.env` cuando despliega él.** Si desplegás desde la
consola, las variables que cargaste en el panel no llegan.

**Los tags hay que pushearlos aparte**, o el workflow de la imagen no se
dispara:

```bash
git push origin main && git push origin --tags
```

**Cambiar el `.env` en local no recarga solo.** El modo watch no lo mira: hay
que reiniciar el backend a mano. Si un cambio de configuración no surte
efecto, es casi siempre esto.

**Elasticsearch se cae solo por memoria.** Si el backend deja de arrancar de
golpe, ese es el primer sospechoso: `docker start temporal-elasticsearch`.
