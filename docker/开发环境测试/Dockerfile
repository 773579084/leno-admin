FROM node:14-alpine

# 设置Git镜像仓库，加快下载速度
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
    && apk update \
    && apk add --no-cache git

# 下载git
RUN apk update \
    && apk add --no-cache git

RUN mkdir -p /home/leno_admin

EXPOSE 9900

CMD tail -f /dev/null


