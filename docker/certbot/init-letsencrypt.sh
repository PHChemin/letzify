#!/bin/bash
set -e

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

if [ -z "$DOMAIN" ] || [ -z "$CERTBOT_EMAIL" ]; then
  echo "Erro: defina DOMAIN e CERTBOT_EMAIL no arquivo .env"
  exit 1
fi

if ! docker compose ps --status running | grep -q web; then
  echo "Erro: o serviço web precisa estar rodando. Execute: docker compose up -d"
  exit 1
fi

staging_arg=""
if [ "${CERTBOT_STAGING:-0}" = "1" ]; then
  staging_arg="--staging"
  echo "Modo staging ativo (certificado de teste)."
fi

echo "Solicitando certificado SSL para ${DOMAIN}..."

docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    ${staging_arg} \
    --email ${CERTBOT_EMAIL} \
    -d ${DOMAIN} \
    --rsa-key-size 4096 \
    --agree-tos \
    --no-eff-email" certbot

echo "Reiniciando Nginx para ativar HTTPS..."
docker compose restart web

echo ""
echo "HTTPS ativo em: https://${DOMAIN}"
echo "Atualize CORS_ORIGIN e API_PUBLIC_URL no .env para usar https:// e rode: docker compose up -d"
