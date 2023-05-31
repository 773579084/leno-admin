import Router from 'koa-router'

import fs from 'fs'
const router = new Router()
console.log(5, __dirname)

fs.readdirSync(__dirname).forEach((file) => {
  console.log(7, file.indexOf('ts'))

  if (file !== 'index.ts') {
    const r = require('./' + file)
    router.use(r.routes())
  }
})

export default router
