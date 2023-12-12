FROM node:17 AS BUILD_IMAGE

WORKDIR /build
COPY . .
RUN npm ci
RUN npm prune --production

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends tzdata
RUN TZ=Asia/Taipei \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && dpkg-reconfigure -f noninteractive tzdata

EXPOSE 3000
CMD [ "node", "index.js" ]