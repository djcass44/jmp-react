FROM alpine:3.9

LABEL maintainer="Django Cass <dj.cass44@gmail.com>"

RUN apk add --update nginx nodejs npm

RUN mkdir -p /var/log/nginx && mkdir -p /var/www/html

COPY nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN cp -r build/* /var/www/html

RUN chown nginx:nginx -R /var/www/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]