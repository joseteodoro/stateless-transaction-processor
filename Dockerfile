FROM node:dubnium

COPY ./ /app

WORKDIR /app

ENV NODE_ENV = 'production'

RUN ["npm", "install", "--only=production"]
CMD ["npm", "start"]
