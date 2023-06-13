FROM node:16.19-alpine

RUN apk --no-cache add curl
RUN apk add make g++ python3 git
RUN npm i -g node-pre-gyp

RUN mkdir /app
WORKDIR /app

COPY package*.json .
COPY .npmrc .
RUN npm i

COPY src ./src
COPY tsconfig.json .
COPY .eslintrc.js .
COPY .env .

CMD npm start