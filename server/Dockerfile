FROM node:16.19-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY pnpm* .
RUN pnpm i

COPY src ./src
COPY tsconfig.json .

CMD npm start