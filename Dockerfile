FROM node:18-alpine as builder

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV NODE_OPTIONS=--openssl-legacy-provider

ADD package*.json ./
RUN npm install --omit=dev
ADD . .
RUN npm run-script build

FROM nginx:alpine
COPY nginx.default.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
COPY --from=builder /build .

EXPOSE 80
