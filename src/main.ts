import '@/config/config.default'
import app from '@/app/index'

const { APP_PORT, APP_HOST, APP_HTTP } = process.env

app.listen(APP_PORT, () => {
  console.log(
    `服务器启动成功,running \x1b[38;2;39;184;219m${APP_HTTP}://${APP_HOST}:${APP_PORT}\x1b[0m`
  )
})
