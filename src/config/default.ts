export default () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      // 服务器运行地址及端口
      APP_HOST: 'localhost',
      APP_PORT: 9000,
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
      APP_HOST: '192.168.59.209',
      APP_PORT: 9000,
      APP_HTTP: 'http',
      // mysql
      MYSQL_HOST: '192.168.59.209',
      MYSQL_PORT: 3306,
      MYSQL_USER: 'root',
      MYSQL_PWD: 'admin123',
      MYSQL_DB: 'leno_admin',
      // JWT
      JWT_SECRET: 'lenoAdmin',
      JWT_REFRESH_SECRET: 'refreshToken',
      // redis
      REDIS_PORT: 6379,
      REDIS_HOST: '192.168.59.209',
      REDIS_PASSWORD: 'admin123',
      REDIS_DB: 0
    }
  }
}
