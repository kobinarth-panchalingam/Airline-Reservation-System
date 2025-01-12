FROM node:22.13.0
ENV NODE_VERSION 22.13.0

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY . .

RUN npm install
