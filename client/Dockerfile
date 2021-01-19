FROM node:12.18.3-alpine as build

ENV NODE_ENV production
WORKDIR /app
COPY package.json .
RUN yarn install --production --silent

ENV REACT_API_BASE_URL=http://api.hotdatafb.com

COPY . .
RUN yarn build

FROM nginx:1.19.2-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
