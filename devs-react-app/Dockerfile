FROM node:18-alpine as builder

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG REACT_APP_BASE_PATH

RUN npm run build

FROM nginx:1.23-alpine

COPY --from=0 /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]