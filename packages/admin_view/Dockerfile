## React Builder
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

ARG VITE_GRAPHQL
ARG VITE_GCP_API_KEY
ARG VITE_AUTH_DOMAIN

ENV VITE_GRAPHQL=${VITE_GRAPHQL}
ENV VITE_GCP_API_KEY=${VITE_GCP_API_KEY}
ENV VITE_AUTH_DOMAIN=${VITE_AUTH_DOMAIN}

# First install and setup view
RUN npm install --workspace=packages/view && \
    npm run build --workspace=packages/view

# Now install dependencies and build the demo
RUN npm install && \
    npm run build --workspace=packages/admin_view

## NGINX Server
FROM nginx:1.25-alpine

COPY packages/demo/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/packages/admin_view/dist /usr/share/nginx/html
