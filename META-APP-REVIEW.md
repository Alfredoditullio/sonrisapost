# Crear la app de Meta y pasar la revisión

Guía para habilitar Instagram y Facebook en SonrisaPost.

Los valores concretos (URLs, permisos, variables) están sacados del código,
no de la documentación de Meta — son los que la app usa de verdad.

> Los nombres de los menús en el panel de Meta cambian seguido. Si algo no se
> llama exactamente así, buscá lo más parecido: el orden de los pasos y los
> datos a cargar son los que importan.

---

## Lo más importante que tenés que saber

**No necesitás la revisión aprobada para probar.**

En modo desarrollo, todos los permisos funcionan con las cuentas que tengan un
rol en la app (la tuya). Podés conectar tu Instagram, publicar de verdad y
verificar que todo anda **hoy**.

La revisión sirve para que funcione con **cuentas de otras personas**.

Esto importa por dos razones: probás sin esperar semanas, y el video que Meta
te va a pedir sólo lo podés grabar con la app funcionando. O sea que probar no
es opcional: es el paso previo a la revisión.

---

## 1. Crear la app

developers.facebook.com → **My Apps** → **Create App**

- Tipo: **Business**
- Nombre: `SonrisaPost`
- Asociala a tu negocio verificado (ya lo tenés)

## 2. Agregar los productos

Dentro de la app, **Add Product**:

- **Facebook Login for Business**
- **Instagram** (la API de Instagram con Facebook Login)

## 3. Cargar las URLs de redirección

En Facebook Login for Business → **Settings** → *Valid OAuth Redirect URIs*:

```
https://sonrisapost.com/integrations/social/facebook
https://sonrisapost.com/integrations/social/instagram
```

**Exactas, sin barra al final.** Si no coinciden carácter por carácter, la
conexión falla con un error que no explica nada.

En Settings → Basic, cargá también:

| Campo | Valor |
|---|---|
| Privacy Policy URL | `https://sonrisapost.com/privacy` |
| Terms of Service URL | `https://sonrisapost.com/terms` |
| User Data Deletion | `https://sonrisapost.com/eliminar-datos` |
| App Domains | `sonrisapost.com` |
| Category | Business and Pages |

Esas tres páginas ya existen y son públicas — las hicimos para esto.

## 4. Cargar las claves en el servidor

De Settings → Basic sacás el **App ID** y el **App Secret**.

En el servidor:

```bash
cd /data/coolify/services/0sjtrhyj7aofdnqvsuoitstg
```

Agregá al `.env` (con `nano .env`):

```
FACEBOOK_APP_ID="..."
FACEBOOK_APP_SECRET="..."
INSTAGRAM_APP_ID="..."
INSTAGRAM_APP_SECRET="..."
```

Instagram vía Facebook Login usa **las mismas claves** que Facebook: repetí
los valores en las cuatro variables.

Y recreá los contenedores, que las variables se leen al nacer:

```bash
docker compose up -d --force-recreate backend orchestrator frontend
```

> Cargá lo mismo en el panel de Coolify. Si algún día desplegás desde ahí,
> Coolify reescribe el `.env` con lo que tiene y te rompe la conexión.

## 5. Dar rol a la cuenta de Instagram — el paso que traba a todos

Antes de poder conectar nada, la cuenta de Instagram necesita un rol en la
app. Sin esto, Instagram corta la autorización con **"Rol de desarrollador
insuficiente"** y ni siquiera intenta volver a SonrisaPost.

Ser administrador de la app **no alcanza**: ese rol es de tu cuenta de
Facebook, y son sistemas de identidad distintos.

1. **Roles de la app → Roles → Más ▾ → Evaluadores de Instagram**
   Ahí se agrega por **nombre de usuario de Instagram**, no por cuenta de
   Facebook. El diálogo general de "Agregar personas" busca cuentas de
   Facebook y no sirve para esto.

2. **Aceptar la invitación desde Instagram.** En la app, con esa cuenta:
   Configuración → Apps y sitios web → Invitaciones de evaluador → Aceptar.

   Este segundo paso es el que más tiempo hace perder: en el panel de Meta
   figura asignado, pero hasta que no se acepta el error es idéntico.

> El rol llamado "Evaluador de Instagram" en el diálogo de personas dice que
> es para la Instagram Basic Display API. Esa descripción está desactualizada
> — el rol es igual el que habilita el modo desarrollo.

## 6. Probar con tu propia cuenta

Necesitás:

- Una **página de Facebook** (creala si no tenés)
- Una cuenta de **Instagram profesional** (Business o Creator) **vinculada a
  esa página**

Ese vínculo no es opcional: la API de Instagram sólo llega a la cuenta a
través de la página de Facebook.

Entrá a SonrisaPost → Agregar canal → Instagram, y conectá.

**Si esto funciona, la parte técnica está terminada.** Lo que sigue es
trámite.

## 7. Grabar el video

### El problema del idioma — leelo antes de grabar

SonrisaPost está **enteramente en español**, y quien revisa probablemente no
lo hable. Es de las causas de rechazo más tontas y más frecuentes: el revisor
no entiende qué está viendo y rechaza por las dudas.

Dos formas de resolverlo, y conviene hacer las dos:

- **Subtítulos o carteles en inglés** sobre el video, indicando qué pasa en
  cada paso ("User connects their Instagram account", "User schedules a
  post", "Post is published automatically").
- **Instrucciones escritas en inglés** en el formulario, paso por paso.

No hace falta traducir la aplicación. Alcanza con que el revisor pueda seguir
lo que ocurre.

### Qué grabar

**Una sola toma continua**, sin cortes. Los cortes generan sospecha: el
revisor tiene que poder ver que el flujo es real y no una secuencia armada.

Guion, en este orden exacto:

1. **Login** en sonrisapost.com. Que se vea la URL en la barra.
2. **Agregar canal → Instagram**. Que se vea la pantalla de autorización de
   Instagram y que la aceptás.
3. **Volver a SonrisaPost** con la cuenta ya conectada, mostrando el nombre y
   la foto de la cuenta. ← esto justifica `instagram_business_basic`
4. **Crear una publicación** con imagen y texto, y **programarla**.
   ← `instagram_business_content_publish`
5. **Esperar a que salga** y mostrarla publicada en Instagram, abriendo la
   cuenta real. Este es el tramo más importante de todo el video.
6. **Analíticas**, mostrando los datos de esa cuenta.
   ← `instagram_business_manage_insights`
7. **Automatizaciones**, mostrando las respuestas a comentarios configuradas,
   y si se puede un comentario respondido de verdad.
   ← `instagram_business_manage_comments`

Duración razonable: entre 3 y 6 minutos. Si esperar a que el post salga lo
alarga mucho, ahí sí se puede acelerar ese tramo — pero dejando ver que el
tiempo pasa.

### Cómo editarlo

**Lo mínimo posible.** No hace falta música, ni cortina, ni edición linda.
Meta no evalúa producción: evalúa si se entiende que el permiso se usa para
lo que decís.

Lo único que sí conviene agregar son los carteles en inglés. Con QuickTime
para grabar y iMovie para los carteles alcanza — las dos vienen en la Mac.

### Un video o varios

Se puede subir **el mismo video en todos los permisos**, indicando en las
instrucciones en qué minuto se ve cada uno:

> The screencast shows this permission in use at 2:15.

Es más simple que cortar cuatro videos y a los revisores les sirve igual.

## 8. Los permisos a solicitar

**Instagram (vía Facebook Login)** — 7:

| Permiso | Para qué lo usa SonrisaPost |
|---|---|
| `instagram_basic` | Leer el perfil de la cuenta conectada |
| `pages_show_list` | Listar las páginas para que el usuario elija |
| `pages_read_engagement` | Resolver qué cuenta de Instagram cuelga de cada página |
| `business_management` | Acceder a las cuentas del negocio |
| `instagram_content_publish` | **Publicar** las publicaciones programadas |
| `instagram_manage_comments` | Responder comentarios automáticamente |
| `instagram_manage_insights` | Mostrar las analíticas |

**Facebook** — 6:

| Permiso | Para qué lo usa SonrisaPost |
|---|---|
| `pages_show_list` | Listar las páginas |
| `business_management` | Acceder a las cuentas del negocio |
| `pages_manage_posts` | **Publicar** en la página |
| `pages_manage_engagement` | Responder comentarios automáticamente |
| `pages_read_engagement` | Leer los comentarios a responder |
| `read_insights` | Mostrar las analíticas |

En cada uno hay que escribir **cómo lo usa la app**. Sé concreto y honesto:
las descripciones genéricas son la causa más común de rechazo.

Ejemplo para `instagram_content_publish`:

> El usuario redacta y programa publicaciones desde el calendario de
> SonrisaPost. Al llegar la fecha, la aplicación las publica en la cuenta de
> Instagram profesional que él mismo conectó y autorizó.

## 9. Enviar

Por cada permiso, Meta pide tres cosas en un formulario:

**1. Cómo lo usa la app.** El texto va acá, no en el video. Las
justificaciones están en la tabla de arriba — usalas como base y escribilas
en inglés.

**2. Instrucciones paso a paso para reproducirlo.** Numeradas, empezando por
el login. Ejemplo:

> 1. Go to https://sonrisapost.com and log in with the test account below.
> 2. Click "Agregar canal" (Add channel) and select Instagram.
> 3. Authorize the Instagram professional account.
> 4. Open the calendar, click any day, write a caption and attach an image.
> 5. Choose a time and click schedule.
> 6. The post is published automatically at the scheduled time.

**3. El video.**

### El usuario de prueba

Esto es lo que más rechazos evita y casi nadie lo hace bien: **creá una
cuenta en SonrisaPost con la cuenta de Instagram ya conectada** y pasale al
revisor el correo y la contraseña en las instrucciones.

Si el revisor tiene que registrarse, conectar su propio Instagram y esperar,
no lo va a hacer: rechaza y sigue.

### Después de enviar

La respuesta suele tardar días. Puede volver:

- **Aprobado** — el permiso pasa a acceso avanzado y funciona con cualquiera.
- **Rechazado** — dice el motivo. Se corrige y se vuelve a enviar; no hay
  penalización por reintentar, sólo se pierde el tiempo del ciclo.
- **Necesita más información** — respondés en el mismo hilo.

Cada permiso se resuelve por separado: pueden aprobarte tres y rechazarte
uno.

## Errores que te van a hacer perder tiempo

**La cuenta de Instagram no es profesional.** Con una cuenta personal no hay
API. Se cambia gratis desde la app de Instagram.

**La cuenta no está vinculada a una página.** Es el error más común y el
mensaje no lo dice.

**La URL de redirección no coincide exacta.** Una barra de más y falla.

**Pedir permisos que no se ven usados en el video.** Meta rechaza el permiso,
no la app entera — pero perdés el ciclo completo de revisión.

---

## Threads, por si lo querés después

Threads tiene su **propia app y su propia revisión**, aparte de esta. Las
variables son `THREADS_APP_ID` y `THREADS_APP_SECRET`. No lo mezcles con este
trámite: primero Instagram y Facebook.
