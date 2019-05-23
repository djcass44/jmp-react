FROM nginx:stable-alpine
LABEL maintainer="Django Cass <dj.cass44@gmail.com>"

RUN apk add --no-cache --update nodejs npm

RUN mkdir -p /var/log/nginx && \
    mkdir -p /var/www/html

COPY nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN cp -r dist/* /var/www/html && \
    chown nginx:nginx /var/www/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]