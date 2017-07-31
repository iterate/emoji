FROM node:8.2.1-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install
COPY . /usr/src/app

ENV NODE_ENV production

EXPOSE 3000

CMD [ "node", "index.js" ]
