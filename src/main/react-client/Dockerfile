# build environment
FROM node:14.18.1-alpine AS build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
COPY yarn.lock /app/package.lock
RUN yarn install --silent
RUN yarn global add react-scripts@3.0.1 --silent
COPY . /app
RUN yarn run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build/ /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
  && ln -sf /dev/stderr /var/log/nginx/error.log

# ENV PORT 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]