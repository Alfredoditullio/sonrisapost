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
# deps — node_modules de produccion, y NADA MAS
# --------------------------------------------------------------------------
#
# Esta etapa existe por una razon concreta y medida: entre dos versiones que
# solo cambiaban textos, el servidor volvia a descargar 795 MB de los 874 que
# pesa la imagen. El 91%.
#
# El culpable no era el install —ese ya estaba cacheado por los manifiestos—
# sino lo que pasaba DESPUES. En la etapa de compilacion, `pnpm run build`,
# `pnpm prune --prod` y `prisma generate` escriben todos adentro de
# node_modules. Con eso, cambiar un texto cambiaba el contenido de la carpeta,
# Docker la veia como una capa nueva y se rebajaba entera.
#
# Aca node_modules se arma partiendo SOLO de los manifiestos y no se vuelve a
# tocar. Mientras no cambien las dependencias, la capa es identica y el
# servidor no la baja.
FROM base AS deps
ARG PRISMA_VERSION

# Modulos nativos (bcrypt, sharp y demas) necesitan compilador.
RUN apt-get update && apt-get install -y --no-install-recommends \
      g++ make python3 \
 && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/orchestrator/package.json ./apps/orchestrator/
COPY apps/commands/package.json ./apps/commands/
COPY apps/extension/package.json ./apps/extension/
COPY apps/sdk/package.json ./apps/sdk/
# Los postinstall necesitan estos dos: prisma generate lee el esquema, y el
# del frontend ejecuta su propio script.
COPY libraries/nestjs-libraries/src/database/prisma ./libraries/nestjs-libraries/src/database/prisma
COPY apps/frontend/scripts ./apps/frontend/scripts

# --prod desde el arranque, en vez de instalar todo y podar despues: podar
# deja la carpeta modificada, que es justo lo que queremos evitar.
#
# El postinstall de prisma usa `pnpm dlx`, que descarga la CLI en el momento,
# asi que funciona igual sin las dependencias de desarrollo.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod

# Fechas de modificacion a cero.
#
# Docker calcula el digest de una capa incluyendo las fechas de cada archivo.
# Sin esto, un install rehecho —porque expiro la cache del CI— genera el mismo
# contenido con fechas nuevas: digest distinto y el servidor rebaja los 750 MB
# igual. Aplanarlas hace que la capa sea reproducible aunque se reconstruya.
RUN find /app/node_modules -exec touch -h -d @0 {} +

# node_modules pesa ~3.5 GB y en una sola capa cualquier corte de red durante
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
    for p in googleapis @swc @opentelemetry @copilotkit posthog-js @nestjs @sentry konva; do \
      [ -e "/app/node_modules/$p" ] || continue; \
      mkdir -p "/nm-b/$(dirname "$p")"; \
      mv "/app/node_modules/$p" "/nm-b/$p"; \
    done

# --------------------------------------------------------------------------
# builder — compila. Su node_modules es descartable: a la imagen final solo
#           llega el codigo compilado, nunca las dependencias de esta etapa.
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

# Primero SOLO lo que necesita la instalacion de dependencias.
#
# Copiar el repositorio entero antes de instalar hacia que cualquier cambio de
# codigo —hasta un SVG— invalidara el install. pnpm se reejecutaba y generaba
# node_modules con marcas de tiempo nuevas: mismo contenido, digest distinto, y
# el servidor volvia a descargar los 750 MB de dependencias en cada version.
#
# Separando los manifiestos del codigo, el install solo se rehace cuando
# cambian de verdad las dependencias.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/orchestrator/package.json ./apps/orchestrator/
COPY apps/commands/package.json ./apps/commands/
COPY apps/extension/package.json ./apps/extension/
COPY apps/sdk/package.json ./apps/sdk/
# Los postinstall necesitan estos dos: prisma generate lee el esquema, y el
# del frontend ejecuta su propio script.
COPY libraries/nestjs-libraries/src/database/prisma ./libraries/nestjs-libraries/src/database/prisma
COPY apps/frontend/scripts ./apps/frontend/scripts

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Recien ahora el codigo. Un cambio aca ya no toca node_modules.
COPY . .

# El build de Next es lo que mas memoria consume del pipeline.
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm run build

# Artefactos de build que no sirven en runtime y solo ocupan espacio.
RUN rm -rf \
      /app/apps/frontend/.next/cache \
      /app/apps/extension \
      /app/.git \
      /root/.cache

# Se aparta SOLO el codigo compilado. node_modules de esta etapa queda atras:
# el de produccion sale de `deps`, que nunca se toco despues de instalarse.
#
# La separacion importa por los numeros: node_modules son ~363.000 archivos
# que cambian solo al tocar package.json, y el codigo compilado son ~3.145
# que cambian en cada despliegue. Juntos en una capa, editar un texto obliga
# al servidor a rebajar y re-extraer los 366.000.
RUN set -eu; \
    mkdir -p /stage; \
    mv /app/apps /stage/apps; \
    mv /app/libraries /stage/libraries; \
    # Imprescindible: la imagen final copia /app de esta etapa para llevarse la
    # configuracion de la raiz. Si node_modules siguiera aca, se copiaria ENCIMA
    # del de `deps` y perderiamos toda la ventaja de haberlo separado.
    rm -rf /app/node_modules

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

# 1. Dependencias — ~363.000 archivos. Vienen de `deps`, que las armo a partir
#    de los manifiestos y no las volvio a tocar: mientras no cambie
#    package.json ni el lockfile, estas tres capas tienen el mismo digest y el
#    servidor no las descarga.
COPY --from=deps --chown=sonrisapost:sonrisapost /app/node_modules /app/node_modules
COPY --from=deps --chown=sonrisapost:sonrisapost /nm-a/ /app/node_modules/
COPY --from=deps --chown=sonrisapost:sonrisapost /nm-b/ /app/node_modules/

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
