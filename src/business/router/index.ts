import Router from 'koa-router'

import fs from 'fs'
const router = new Router()

function registerRouter(basePath: string, routerPath: string) {
  fs.readdirSync(basePath).forEach((file) => {
    // 遇到文件夹则递归回调
    if (file.indexOf('ts') === -1) {
      registerRouter(`${basePath}\\${file}`, `${routerPath}${file}/`)
    }

    if (file !== 'index.ts' && file.indexOf('ts') !== -1) {
      const r = require(routerPath + file)
      router.use(r.routes())
    }
  })
}
registerRouter(__dirname, './')

export default router
