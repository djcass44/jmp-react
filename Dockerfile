# STAGE 1 - BUILD
FROM node:lts-alpine as BUILDER
LABEL maintainer="Django Cass <dj.cass44@gmail.com>"

# disable spammy donation messages
ENV DISABLE_OPENCOLLECTIVE=true

WORKDIR /app

COPY package*.json ./
RUN npm install --quiet

COPY ./public ./public
COPY ./src ./src
COPY ./tsconfig.json .
COPY .env.* ./

RUN npm run build

# STAGE 2 - RUN
FROM nginx:stable-alpine
LABEL maintainer="Django Cass <dj.cass44@gmail.com>"

RUN mkdir -p /var/log/nginx && mkdir -p /var/www/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=BUILDER /app/build /var/www/html

RUN touch /tmp/nginx.pid && \
  chown -R nginx:nginx /tmp/nginx.pid && \
  chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /var/www/html

USER nginx

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]