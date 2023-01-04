import Router from 'koa-router'
import auth from '../middleware/auth.middleware'
// 格式转换
import formatHandle from '../middleware/formatHandle'
// user
import { getUserListCon } from '../controller/system/user.controller'
import { getUserListMid } from '../middleware/system/user.middleware'
// menu
import { getRoutersCon } from '../controller/system/menu.controller'
import { getRouterMid } from '../middleware/system/menu.middleware'
const router = new Router({ prefix: '/system' })

// #region 用户管理
// 查询列表用户
router.get('/user/list', auth, getUserListMid, formatHandle, getUserListCon)
// #endregion

// 获取路由
router.get('/menu/getRouters', auth, getRouterMid, getRoutersCon)

module.exports = router
