FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/

RUN npm ci -w api

COPY apps/api ./apps/api

WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app/apps/api

ENV NODE_ENV=production

RUN apk add --no-cache openssl wget

COPY --from=builder /app/package.json /app/package-lock.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json

RUN mkdir -p uploads

VOLUME ["/app/apps/api/uploads"]

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
