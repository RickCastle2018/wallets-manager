# https://nodejs.org/ru/docs/guides/nodejs-docker-webapp/

FROM node:14-alpine

WORKDIR /service

COPY package*.json .

# FIX: usb module crash
RUN npm install --no-optional

COPY . .

EXPOSE 2311
CMD [ "node", "server.js" ]
