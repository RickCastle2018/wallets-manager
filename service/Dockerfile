FROM node:14-alpine

WORKDIR /service

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 2311
CMD [ "node", "server.js" ]
