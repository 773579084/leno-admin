import '@/config/config.default'
import app from '@/app/index'
const { APP_PORT, APP_HOST, APP_HTTP } = process.env

app.listen(APP_PORT, () => {
  console.log('\x1b[34m%s\x1b[0m', `服务器启动成功,running ${APP_HTTP}://${APP_HOST}:${APP_PORT}`)
})
