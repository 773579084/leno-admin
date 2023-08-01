# 前后端开发环境Dockerfile
FROM node:14-alpine

# 设置Git镜像仓库，加快下载速度
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
    && apk update \
    && apk add --no-cache git

# 下载git
RUN apk update \
    && apk add --no-cache git

RUN mkdir -p /home/leno_admin

# 设置镜像源
RUN npm config set registry https://registry.npm.taobao.org

ENV NPM_CONFIG_LOGLEVEL warn

EXPOSE 9900

CMD []
