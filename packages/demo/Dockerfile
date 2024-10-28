## React Builder
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

ARG VITE_GRAPHQL
ARG VITE_DEFAULT_LEX

ENV VITE_GRAPHQL ${VITE_GRAPHQL}
ENV VITE_DEFAULT_LEX ${VITE_DEFAULT_LEX}

# First install and setup view
RUN npm install --workspace=packages/view && \
    npm run build --workspace=packages/view

# Now install dependencies and build the demo
RUN npm install && \
    npm run build --workspace=packages/demo

## NGINX Server
FROM nginx:1.25-alpine

COPY packages/demo/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/packages/demo/dist /usr/share/nginx/html
