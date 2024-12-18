## React Builder
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

ARG VITE_GRAPHQL
ARG VITE_DEFAULT_LEX

ENV VITE_GRAPHQL ${VITE_GRAPHQL}
ENV VITE_DEFAULT_LEX ${VITE_DEFAULT_LEX}

# Now install dependencies and build the demo
RUN npm install && \
    npm run build

## NGINX Server
FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
