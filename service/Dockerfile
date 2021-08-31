# https://nodejs.org/ru/docs/guides/nodejs-docker-webapp/

FROM node:14-alpine

WORKDIR /service

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

COPY package.json .
COPY package-lock.json .

# FIX: usb module crash
RUN npm install --no-optional

COPY . .

EXPOSE 2311
CMD [ "node", "server.js" ]
