# PRD §25 — multi-stage, non-root, healthcheck
FROM node:26-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts
COPY . .
# reproducible build — falla si hay error de tipos/tests
RUN npm run typecheck && npm run test && npm run build

FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# health endpoint — static file + non-root hardening
RUN echo "ok" > /usr/share/nginx/html/health && \
    addgroup -S neotype && adduser -S neotype -G neotype && \
    chown -R neotype:neotype /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && chown neotype:neotype /var/run/nginx.pid && \
    chmod -R 755 /usr/share/nginx/html
USER neotype
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://localhost:8080/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
