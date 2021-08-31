# https://nodejs.org/ru/docs/guides/nodejs-docker-webapp/

FROM node:14-alpine

WORKDIR /service

# ENV PYTHONUNBUFFERED=1
# RUN apk add --update --no-cache python2 && ln -sf python2 /usr/bin/python
# RUN python -m ensurepip
# RUN pip install --no-cache --upgrade pip setuptools
# RUN apk add --update make
# RUN apk add gcc 
# RUN apk add g++

COPY package.json .
COPY package-lock.json .

# FIX: usb module crash
RUN npm install --no-optional

COPY . .

EXPOSE 2311
CMD [ "node", "server.js" ]
