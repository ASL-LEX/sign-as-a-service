## React Builder
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

ARG VITE_GRAPHQL_ENDPOINT
ARG VITE_GCP_API_KEY
ARG VITE_AUTH_DOMAIN

ENV VITE_GRAPHQL_ENDPOINT=${VITE_GRAPHQL_ENDPOINT}
ENV VITE_GCP_API_KEY=${VITE_GCP_API_KEY}
ENV VITE_AUTH_DOMAIN=${VITE_AUTH_DOMAIN}

# Now install dependencies and build the demo
RUN npm install && \
    npm run build

## NGINX Server
FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
