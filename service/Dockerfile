# https://nodejs.org/ru/docs/guides/nodejs-docker-webapp/

FROM node:14

WORKDIR /service

COPY package*.json ./

RUN apt-get update
RUN apt-get install -y libudev-dev libusb-dev usbutils

# FIX: usb module crash. Can't use npm install
RUN npm install express
RUN npm install mongodb
RUN npm install mongoose
RUN npm install @binance-chain/javascript-sdk --no-optional

COPY . .

EXPOSE 2311
CMD [ "node", "server.js" ]
