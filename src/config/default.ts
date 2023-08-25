export default () => {
  if (process.env.NODE_ENV === 'development') {
    // windows和mac都是通过host.docker.internal连接宿主机
    return {
      // 服务器运行地址及端口
      APP_HOST: 'localhost',
      APP_PORT: 9090,
      APP_HTTP: 'http',
      // mysql
      MYSQL_HOST: 'localhost',
      MYSQL_PORT: 3306,
      MYSQL_USER: 'root',
      MYSQL_PWD: 'admin123',
      MYSQL_DB: 'leno_admin',
      // JWT
      JWT_SECRET: 'lenoAdmin',
      JWT_REFRESH_SECRET: 'refreshToken',
      // redis
      REDIS_PORT: 6379,
      REDIS_HOST: 'localhost',
      REDIS_PASSWORD: 'admin123',
      REDIS_DB: 0,
      // 图片路径
      IMG_URL: 'http://localhost:9090/uploads/'
    }
  } else if (process.env.NODE_ENV === 'docker-desktop') {
    return {
      // 服务器运行地址及端口
      APP_HOST: 'localhost',
      APP_PORT: 9090,
      APP_HTTP: 'http',
      // mysql
      MYSQL_HOST: 'mysql',
      MYSQL_PORT: 4000,
      MYSQL_USER: 'root',
      MYSQL_PWD: 'Aa363689;',
      MYSQL_DB: 'leno_admin',
      // JWT
      JWT_SECRET: 'lenoAdmin',
      JWT_REFRESH_SECRET: 'refreshToken',
      // redis
      REDIS_PORT: 4100,
      // REDIS_HOST: 'host.docker.internal',
      REDIS_HOST: 'host.docker.internal',
      REDIS_PASSWORD: 'admin123',
      REDIS_DB: 0,
      // 图片路径
      IMG_URL: 'http://localhost:9090/uploads/'
    }
  } else if (process.env.NODE_ENV === 'production') {
    return {
      // 服务器运行地址及端口
      APP_HOST: 'localhost',
      APP_PORT: 9000,
      APP_HTTP: 'http',
      // mysql
      MYSQL_HOST: 'mysql',
      MYSQL_PORT: 3306,
      MYSQL_USER: 'root',
      MYSQL_PWD: 'Aa363689;',
      MYSQL_DB: 'leno_admin',
      // JWT
      JWT_SECRET: 'lenoAdmin',
      JWT_REFRESH_SECRET: 'refreshToken',
      // redis
      REDIS_PORT: 6379,
      REDIS_HOST: 'redis',
      REDIS_PASSWORD: 'admin123',
      REDIS_DB: 0,
      // 图片路径
      IMG_URL: 'http://zhaowenchao.top/uploads/'
    }
  }
}
