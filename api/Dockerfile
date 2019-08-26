FROM node:latest

ENV NODE_ENV production

WORKDIR /usr/app/src

COPY build.sh .
COPY .env* ./

RUN ./build.sh

COPY ./package*.json ./

RUN npm install

COPY . .

CMD ["npm",  "start"]
