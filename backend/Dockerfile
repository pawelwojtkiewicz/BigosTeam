# Based on:
# https://docs.docker.com/language/nodejs/build-images/
# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
FROM node:20.10.0-alpine3.19

RUN apk update && \
    apk upgrade && \
    apk add --no-cache libc6-compat dumb-init

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

ENV NODE_ENV production

COPY . .
RUN npm run build

USER node

CMD ["dumb-init", "node", "server.js"]
