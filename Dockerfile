FROM node:20-alpine AS builder
WORKDIR /app

COPY nextjs-app/package*.json ./
RUN npm ci

COPY nextjs-app/ ./

RUN npm run build

# Копируем именно папку build, она у тебя содержит готовый фронтенд
FROM nginx:1.25-alpine

COPY --from=builder /build /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/nginx.conf
