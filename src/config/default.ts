export default () => {
  // 重要：需要 cross-env 注入变量启动，才能够全局使用，直接用node启动文件无法获取变量
  if (process.env.NODE_ENV === 'development') {
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
      REDIS_DB: 0
    }
  } else {
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
      REDIS_DB: 0
    }
  }
}
