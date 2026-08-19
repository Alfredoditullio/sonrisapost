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

## 5. Probar con tu propia cuenta

Necesitás:

- Una **página de Facebook** (creala si no tenés)
- Una cuenta de **Instagram profesional** (Business o Creator) **vinculada a
  esa página**

Ese vínculo no es opcional: la API de Instagram sólo llega a la cuenta a
través de la página de Facebook.

Entrá a SonrisaPost → Agregar canal → Instagram, y conectá.

**Si esto funciona, la parte técnica está terminada.** Lo que sigue es
trámite.

## 6. Grabar el video

Meta pide un video por cada permiso, mostrando **para qué lo usás**. Es lo que
más rechazos genera: no alcanza con mostrar la pantalla, hay que mostrar el
flujo completo desde el login.

Grabá una sola pasada larga que muestre, en este orden:

1. Iniciar sesión en SonrisaPost
2. Agregar canal → elegir Instagram → autorizar en Meta
3. Ver la lista de páginas/cuentas y elegir una
4. Crear una publicación con imagen y programarla
5. Verla publicada en Instagram
6. Entrar a Analíticas y mostrar los datos de esa cuenta
7. Entrar a Automatizaciones y mostrar las respuestas a comentarios

Después recortás los tramos que corresponden a cada permiso.

## 7. Los permisos a solicitar

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

## 8. Enviar

App Review → Permissions and Features → pedir cada permiso → adjuntar video e
instrucciones de prueba.

**Dales un usuario de prueba** con una cuenta ya conectada. Si el revisor no
puede reproducir el flujo, rechaza sin más.

---

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
