FROM node:lts-alpine

RUN mkdir /app
WORKDIR /app

COPY .npmrc .
COPY package*.json .
RUN npm i

COPY src ./src
COPY public ./public
COPY tsconfig.json .
COPY tailwind.config.js .
COPY postcss.config.js .
COPY codegen.yml .

CMD npm start