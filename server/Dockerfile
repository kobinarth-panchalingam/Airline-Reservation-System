FROM alpine:3.21

ENV NODE_VERSION 22.13.0

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY . .

USER node

RUN npm install

COPY --chown=node:node . .