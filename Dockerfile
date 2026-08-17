# syntax=docker/dockerfile:1.7
#
# Imagen de produccion de SonrisaPost.
#
# Una sola imagen, tres procesos. El frontend, el backend y el orchestrator
# comparten el mismo arbol de dependencias (pnpm con node-linker=hoisted), asi
# que construirlos por separado significaria instalar tres veces lo mismo. En
# cambio se construye una vez y cada servicio del compose arranca su propio
# proceso con su propio comando, sus propios limites de memoria y su propia
# politica de reinicio.
#
# Eso da lo que importa para escalar:
#   - se escala el proceso que satura, no los tres a la vez
#   - si el orchestrator se queda sin memoria, la web sigue en pie
#   - se reinicia uno sin tocar los otros
#
# El build es multi-etapa: el toolchain de compilacion (g++, make, python3) y
# las dependencias de desarrollo no llegan a la imagen final.

ARG NODE_IMAGE=node:22.20-bookworm-slim
ARG PNPM_VERSION=10.6.1
ARG PRISMA_VERSION=6.5.0

# --------------------------------------------------------------------------
# base — runtime minimo comun a todas las etapas
# --------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS base
ARG PNPM_VERSION
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    CI=1
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

# --------------------------------------------------------------------------
# builder — instala todo, compila, y despues poda lo que no corre en produccion
# --------------------------------------------------------------------------
FROM base AS builder
ARG PRISMA_VERSION
ARG NEXT_PUBLIC_VERSION
ENV NEXT_PUBLIC_VERSION=$NEXT_PUBLIC_VERSION

# Modulos nativos (bcrypt, sharp y demas) necesitan compilador. Se queda en
# esta etapa: la imagen final no lo lleva.
RUN apt-get update && apt-get install -y --no-install-recommends \
      g++ make python3 \
 && rm -rf /var/lib/apt/lists/*

COPY . .

# El store de pnpm se cachea entre builds: reconstruir tras un cambio de codigo
# no vuelve a bajar el arbol entero de dependencias.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# El build de Next es lo que mas memoria consume del pipeline.
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm run build

# Podar las dependencias de desarrollo. El cliente de Prisma vive dentro de
# node_modules, asi que la poda se lo lleva puesto y hay que regenerarlo
# despues — de ahi el orden.
RUN pnpm prune --prod \
 && pnpm dlx prisma@${PRISMA_VERSION} generate \
      --schema ./libraries/nestjs-libraries/src/database/prisma/schema.prisma

# Artefactos de build que no sirven en runtime y solo ocupan espacio.
RUN rm -rf \
      /app/apps/frontend/.next/cache \
      /app/apps/extension \
      /app/.git \
      /root/.cache

# node_modules pesa ~3.9 GB y en una sola capa cualquier corte de red durante
# el pull obliga a rebajar los 800 MB comprimidos desde cero. Separando los
# paquetes mas grandes en dos grupos, la imagen queda en tres capas parejas y
# Docker reintenta solo la que fallo.
#
# No se borra nada: los mismos archivos terminan en la misma ruta final.
RUN set -eu; \
    mkdir -p /nm-a /nm-b; \
    for p in @walletconnect @next next @langchain @temporalio @mastra @meronex; do \
      [ -e "/app/node_modules/$p" ] || continue; \
      mkdir -p "/nm-a/$(dirname "$p")"; \
      mv "/app/node_modules/$p" "/nm-a/$p"; \
    done; \
    for p in googleapis @blueprintjs @swc @opentelemetry @copilotkit posthog-js @nestjs @sentry; do \
      [ -e "/app/node_modules/$p" ] || continue; \
      mkdir -p "/nm-b/$(dirname "$p")"; \
      mv "/app/node_modules/$p" "/nm-b/$p"; \
    done

# Separar dependencias de codigo.
#
# node_modules son 363.000 archivos que cambian solo al tocar package.json.
# El codigo compilado son 3.145 y cambia en cada despliegue. Juntos en una
# capa, editar un texto obliga a rebajar y re-extraer los 366.000 — eso
# convertia un cambio trivial en media hora de espera.
#
# Separados, un cambio de codigo mueve 3.145 archivos y el resto se reutiliza
# de lo que el servidor ya tiene en disco.
RUN set -eu; \
    mkdir -p /stage; \
    mv /app/node_modules /stage/node_modules; \
    mv /app/apps /stage/apps; \
    mv /app/libraries /stage/libraries

# --------------------------------------------------------------------------
# runtime — imagen final
# --------------------------------------------------------------------------
FROM base AS runtime
ARG PRISMA_VERSION
ENV NODE_ENV=production \
    PRISMA_VERSION=${PRISMA_VERSION}

# curl para los healthchecks; tini para que las señales lleguen al proceso de
# node y los contenedores paren limpio en vez de por timeout.
RUN apt-get update && apt-get install -y --no-install-recommends \
      curl tini \
 && rm -rf /var/lib/apt/lists/* \
 && groupadd --system --gid 1001 sonrisapost \
 && useradd --system --uid 1001 --gid sonrisapost --home /app sonrisapost

# Capas ordenadas de lo mas estable a lo que mas cambia. Docker reutiliza por
# digest: si el contenido de una capa no cambia, el servidor no la vuelve a
# descargar ni a extraer.

# 1. Dependencias — 363.000 archivos, cambian solo al tocar package.json
COPY --from=builder --chown=sonrisapost:sonrisapost /stage/node_modules /app/node_modules
COPY --from=builder --chown=sonrisapost:sonrisapost /nm-a/ /app/node_modules/
COPY --from=builder --chown=sonrisapost:sonrisapost /nm-b/ /app/node_modules/

# 2. Configuracion de la raiz del monorepo — unos pocos archivos
COPY --from=builder --chown=sonrisapost:sonrisapost /app /app

# 3. Codigo compilado — 3.145 archivos, cambia en cada despliegue
COPY --from=builder --chown=sonrisapost:sonrisapost /stage/libraries /app/libraries
COPY --from=builder --chown=sonrisapost:sonrisapost /stage/apps /app/apps

# WORKDIR crea /app como root: aunque el contenido se copie con --chown, el
# directorio en si queda ajeno al usuario y este no puede crear nada nuevo
# adentro. Rompe cualquier herramienta que necesite escribir cache (corepack,
# pnpm dlx) al correr comandos dentro del contenedor.
RUN chown sonrisapost:sonrisapost /app && mkdir -p /app/.cache \
 && chown -R sonrisapost:sonrisapost /app/.cache
ENV HOME=/app

# Nunca como root: si un proceso se compromete, no arranca con todos los
# permisos del contenedor.
USER sonrisapost

ENTRYPOINT ["/usr/bin/tini", "--"]

# Sin comando por defecto: cada servicio del compose define el suyo. Si alguien
# corre la imagen sin especificar, que falle de forma obvia y no a medias.
CMD ["node", "-e", "console.error('Especifica un comando: frontend, backend u orchestrator. Ver docker-compose.prod.yaml'); process.exit(1)"]
