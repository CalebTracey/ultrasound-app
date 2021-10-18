# build environment
FROM node:14.15.3-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/
RUN yarn --silent
RUN yarn global add react-scripts@3.0.1 -g --silent
COPY . /app
RUN yarn run build

