import Router from 'koa-router'
import auth from '../middleware/auth.middleware'
import { getRoutersCon } from '../controller/system/menu.controller'
import { getRouterMid } from '../middleware/system/menu.middleware'

const router = new Router({ prefix: '/system' })

// 获取路由
router.get('/menu/getRouters', auth, getRouterMid, getRoutersCon)

module.exports = router
