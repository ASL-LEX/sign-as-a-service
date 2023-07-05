FROM node:18-alpine as builder

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build


FROM node:18-alpine as production

WORKDIR /usr/src/app

COPY package*.json .
COPY --from=builder /usr/src/app/dist ./dist
RUN npm install --omit=dev

CMD ["npm", "run", "start:prod"]
