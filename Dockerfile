# STAGE 1 - BUILD
FROM node:lts-alpine as BUILDER
LABEL maintainer="Django Cass <dj.cass44@gmail.com>"

WORKDIR /app

COPY package*.json ./
RUN npm install --quiet

COPY . ./
RUN npm run build

# STAGE 2 - RUN
FROM nginx:stable-alpine
LABEL maintainer="Django Cass <dj.cass44@gmail.com>"

RUN mkdir -p /var/log/nginx && mkdir -p /var/www/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=BUILDER /app/build /var/www/html

RUN chown nginx:nginx -R /var/www/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]