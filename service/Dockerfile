# https://nodejs.org/ru/docs/guides/nodejs-docker-webapp/

FROM node:14-alpine

WORKDIR /service

COPY . .

# FIX: usb module crash. Can't use npm install: --no-optional
RUN npm install --no-optional

EXPOSE 2311
CMD [ "node", "server.js" ]
