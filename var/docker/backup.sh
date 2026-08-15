#!/bin/sh
# Backup de la base de SonrisaPost a almacenamiento S3 (Cloudflare R2).
#
# Pensado para correr desde cron dentro del contenedor de Postgres, o desde el
# host con `docker exec`. Ver DEPLOY.md.
#
# Decisiones que importan:
#   - pg_dump con --format=custom: permite restaurar tablas sueltas y comprime
#     mejor que SQL plano.
#   - Se verifica que el dump no este vacio ANTES de subirlo. Un backup de 0
#     bytes que pisa al bueno es peor que no tener backup.
#   - Falla ruidosamente. Un backup que falla en silencio te deja creyendo que
#     estas cubierto, que es la peor de las situaciones posibles.
set -eu

FECHA="$(date -u +%Y%m%d-%H%M%S)"
ARCHIVO="/tmp/sonrisapost-${FECHA}.dump"
MINIMO_BYTES="${BACKUP_MIN_BYTES:-10240}"

log() { echo "[backup] $(date -u +%H:%M:%S) $*"; }
morir() { echo "[backup] ERROR: $*" >&2; exit 1; }

: "${POSTGRES_USER:?falta POSTGRES_USER}"
: "${POSTGRES_DB:?falta POSTGRES_DB}"

log "generando dump de ${POSTGRES_DB}"
pg_dump --username="${POSTGRES_USER}" --dbname="${POSTGRES_DB}" \
        --format=custom --compress=9 --file="${ARCHIVO}" \
  || morir "pg_dump fallo"

TAMANO=$(wc -c < "${ARCHIVO}")
if [ "${TAMANO}" -lt "${MINIMO_BYTES}" ]; then
  rm -f "${ARCHIVO}"
  morir "el dump pesa ${TAMANO} bytes (minimo ${MINIMO_BYTES}). No se sube: un backup vacio pisando al anterior es peor que ninguno."
fi
log "dump listo: ${TAMANO} bytes"

# La subida es opcional: sin credenciales el dump queda en el contenedor y el
# script avisa. Sirve para probar el flujo antes de configurar R2.
if [ -z "${S3_BUCKET:-}" ]; then
  log "AVISO: S3_BUCKET no configurado. El dump queda en ${ARCHIVO} y NO esta a salvo de una perdida del servidor."
  exit 0
fi

command -v aws >/dev/null 2>&1 || morir "falta el cliente aws. Ver DEPLOY.md."

log "subiendo a s3://${S3_BUCKET}/"
aws s3 cp "${ARCHIVO}" "s3://${S3_BUCKET}/postgres/sonrisapost-${FECHA}.dump" \
    ${S3_ENDPOINT:+--endpoint-url "${S3_ENDPOINT}"} \
  || morir "la subida fallo"

rm -f "${ARCHIVO}"
log "backup completo"

# Retencion: borra lo mas viejo que BACKUP_RETENTION_DAYS (por defecto 30).
DIAS="${BACKUP_RETENTION_DAYS:-30}"
LIMITE=$(date -u -d "-${DIAS} days" +%Y%m%d 2>/dev/null || date -u -v-"${DIAS}"d +%Y%m%d)
log "limpiando backups anteriores a ${LIMITE}"
aws s3 ls "s3://${S3_BUCKET}/postgres/" \
    ${S3_ENDPOINT:+--endpoint-url "${S3_ENDPOINT}"} \
  | awk '{print $4}' | grep '^sonrisapost-' | while read -r nombre; do
      fecha=$(echo "${nombre}" | sed 's/sonrisapost-\([0-9]\{8\}\).*/\1/')
      if [ "${fecha}" -lt "${LIMITE}" ] 2>/dev/null; then
        log "  borrando ${nombre}"
        aws s3 rm "s3://${S3_BUCKET}/postgres/${nombre}" \
            ${S3_ENDPOINT:+--endpoint-url "${S3_ENDPOINT}"} || true
      fi
    done
log "listo"
