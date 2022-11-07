import Router from 'koa-router'
import auth from '../middleware/auth.middleware'
import { getRoutersCon } from '../controller/menu.controller'

const router = new Router({ prefix: '/system' })

// 获取路由
router.get('/menu/getRouters', auth, getRoutersCon)

module.exports = router
