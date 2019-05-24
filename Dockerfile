# STEP 1 - Build
FROM node:lts-alpine as NPM_BUILDER
LABEL maintainer="Django Cass <dj.cass44@gmail.com>"

WORKDIR /build
COPY package*.json ./

# install dependencies
RUN npm install

COPY . .

# build optimised files
RUN npm run build

# STEP 2 - Run
FROM nginx:stable-alpine
LABEL maintainer="Django Cass <dj.cass44@gmail.com>"

RUN mkdir -p /var/log/nginx && \
    mkdir -p /var/www/html

COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Get the built files in place
COPY --from=NPM_BUILDER /build/build/* /var/www/html/
RUN chown nginx:nginx /var/www/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]