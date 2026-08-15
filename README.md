<div align="center">
  <img src="apps/frontend/public/logo-text.svg" alt="SonrisaPost" height="48" />
  <p><strong>Publicá en todas tus redes desde un solo calendario.</strong></p>
  <p>Gratis, self-hosted, código abierto (AGPL-3.0).</p>
</div>

---

## Qué es

SonrisaPost es una herramienta de programación de contenido para redes
sociales: calendario, publicación en 28+ canales, biblioteca de medios,
analíticas y gestión de equipo. Se corre en tu propio servidor y no tiene
límite de publicaciones ni planes pagos.

Es un **fork rebrandeado de [Postiz](https://github.com/gitroomhq/postiz-app)**
(© Nevo David, AGPL-3.0). No está afiliado ni respaldado por Postiz ni Gitroom.
Ver [`NOTICE.md`](NOTICE.md) para la atribución completa y la lista de cambios.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js (React) |
| Backend | NestJS |
| Jobs | Temporal (`apps/orchestrator`) |
| Base de datos | PostgreSQL vía Prisma |
| Cache/colas | Redis |
| Monorepo | pnpm workspaces |

```
apps/backend        API (NestJS)
apps/frontend       UI (Next.js)
apps/orchestrator   workflows y jobs (Temporal)
apps/extension      extensión de navegador
apps/sdk            SDK de la API pública
libraries/          código compartido entre apps
```

## Requisitos

- Node.js `>=22.12 <23`
- pnpm 10.6.1 (`corepack enable && corepack prepare pnpm@10.6.1 --activate`)
- Docker (para Postgres + Redis en local)

## Levantarlo en local

```bash
cp .env.example .env
```

Editá `.env` — como mínimo:

```
DATABASE_URL="postgresql://sonrisapost-local:sonrisapost-local-pwd@localhost:5433/sonrisapost-db-local"
REDIS_URL="redis://localhost:6379"
NEXT_PUBLIC_BACKEND_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:4200"
JWT_SECRET="<algo largo y aleatorio>"
NEXT_PUBLIC_SOURCE_CODE_URL="https://github.com/<tu-org>/<tu-repo>"
```

Después:

```bash
pnpm install
pnpm run dev:docker
pnpm run prisma-db-push
pnpm run dev
```

La UI queda en <http://localhost:4200> y la API en <http://localhost:3000>.

## Variables de entorno propias de este fork

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SOURCE_CODE_URL` | **Obligatoria en producción.** URL pública del código que estás corriendo. Requisito del §13 de la AGPL. |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | Dominio propio para Plausible/Datafast. Vacío = sin analytics. |
| `SONRISAPOST_OAUTH_*` | OAuth genérico (antes `POSTIZ_OAUTH_*`). |

El resto de las variables está documentado en `.env.example` y, para lo que este
fork no cambió, en la [documentación de Postiz](https://docs.postiz.com/configuration/reference).

## Licencia y obligaciones

Este proyecto está bajo **AGPL-3.0** ([`LICENSE`](LICENSE)) y así tiene que
seguir. Si lo desplegás para que otras personas lo usen por red — aunque sea
gratis — la licencia te obliga a:

1. **Publicar tu código fuente**, incluidas tus modificaciones, bajo AGPL-3.0.
2. **Ofrecerlo visiblemente a los usuarios** de la app (§13). Eso lo cubre el
   componente `SourceLinkComponent`; configurá `NEXT_PUBLIC_SOURCE_CODE_URL` y
   no lo borres.
3. **Conservar** `LICENSE`, `NOTICE.md` y los avisos de copyright originales.
4. **Documentar tus cambios** en `NOTICE.md`.

Lo que **no** te da la licencia: el derecho a usar la marca "Postiz" o "Gitroom",
ni a sugerir que el proyecto original te avala.
