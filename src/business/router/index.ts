import Router from 'koa-router'

import fs from 'fs'
const router = new Router()

fs.readdirSync(__dirname).forEach((file) => {
  if (file !== 'index.ts') {
    const r = require('./' + file)
    router.use(r.routes())
  }
})

export default router
