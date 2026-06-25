FROM node:20-alpine AS web-builder

WORKDIR /app

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/

RUN npm ci -w web

COPY apps/web ./apps/web

WORKDIR /app/apps/web
RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache gettext

COPY docker/nginx/includes/proxy-locations.conf /etc/nginx/includes/proxy-locations.conf
COPY docker/nginx/conf/ip-only.conf /etc/nginx/templates/ip-only.conf
COPY docker/nginx/conf/http-domain.conf.template /etc/nginx/templates/http-domain.conf.template
COPY docker/nginx/conf/https.conf.template /etc/nginx/templates/https.conf.template
COPY docker/nginx/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY --from=web-builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80 443

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
