FROM node:16.19-alpine

RUN apk --no-cache add curl

RUN mkdir /app
WORKDIR /app

COPY package*.json .
COPY .npmrc .

RUN npm i

COPY src ./src
COPY public ./public
COPY tsconfig.json .
COPY tailwind.config.js .
COPY postcss.config.js .
COPY codegen.yml .
COPY .env .

CMD npm start