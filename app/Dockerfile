FROM node:12.18.3-alpine as build

WORKDIR /app

COPY package.json .
RUN yarn install --production --silent

COPY . .
CMD ["yarn", "start"]

