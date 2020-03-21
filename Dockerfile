# STAGE 1 - BUILD
FROM node:lts-alpine as BUILDER
LABEL maintainer="Django Cass <django@dcas.dev>"

# disable spammy donation messages
ENV DISABLE_OPENCOLLECTIVE=true

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY ./public ./public
COPY ./src ./src
COPY ./tsconfig.json .

RUN npm run build

# STAGE 2 - RUN
FROM nginx:stable-alpine
LABEL maintainer="Django Cass <django@dcas.dev>"

# update system packages
RUN apk upgrade --no-cache && \
    apk add --no-cache bash

RUN mkdir -p /var/log/nginx && mkdir -p /var/www/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /var/www/html

COPY --from=BUILDER /app/build .

# copy .env file and shell script
COPY ./env.sh .
COPY .env .

RUN touch /tmp/nginx.pid && \
  chown -R nginx:nginx /tmp/nginx.pid && \
  chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /var/www/html

RUN chmod +x /var/www/html/env.sh

USER nginx

EXPOSE 8080
# start NGINX
CMD ["/bin/bash", "-c", "/var/www/html/env.sh && nginx -g \"daemon off;\""]