#!/bin/sh
set -e

DOMAIN="${DOMAIN:-}"
TEMPLATE_DIR="/etc/nginx/templates"
OUTPUT="/etc/nginx/conf.d/default.conf"

if [ -z "$DOMAIN" ]; then
  cp "${TEMPLATE_DIR}/ip-only.conf" "$OUTPUT"
elif [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
  envsubst '${DOMAIN}' < "${TEMPLATE_DIR}/https.conf.template" > "$OUTPUT"
else
  envsubst '${DOMAIN}' < "${TEMPLATE_DIR}/http-domain.conf.template" > "$OUTPUT"
fi

exec "$@"
