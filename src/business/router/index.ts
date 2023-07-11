import Router from 'koa-router'

import fs from 'fs'
const router = new Router()

function registerRouter(basePath: string) {
  fs.stat(basePath, (err, stats) => {
    if (err) {
      console.error(err)
      return
    }

    if (stats.isDirectory()) {
      // 遇到文件夹则递归回调
      fs.readdirSync(basePath).forEach((file) => {
        registerRouter(`${basePath}\\${file}`)
      })
    } else if (stats.isFile()) {
      if (basePath.indexOf('index') === -1) {
        const r = require(basePath)
        router.use(r.routes())
      }
    } else {
      console.log('这是一个特殊的类型（不是文件也不是文件夹）')
    }
  })
}

registerRouter(__dirname)

export default router
