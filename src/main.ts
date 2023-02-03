import env from '@/config/config.default'
import app from '@/app/index'
const { APP_PORT, APP_HOST } = env

app.listen(APP_PORT, () => {
  console.log(`服务器启动成功,running http://${APP_HOST}:${APP_PORT}`)
})
