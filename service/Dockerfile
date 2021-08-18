# https://nodejs.org/ru/docs/guides/nodejs-docker-webapp/

FROM node:14

WORKDIR /service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
