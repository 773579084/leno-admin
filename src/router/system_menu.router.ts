/**
 * 菜单管理
 */
import Router from 'koa-router'
import auth from '@/middleware/auth.middleware'
// 格式转换
import { formatHandle } from '@/middleware/formatHandle'
import { judgeIdSchema, verifyMid } from '@/middleware/common.middleware'
import { menuCon } from '@/controller/system/menu.controller'
import {
  getRouterMid,
  conversionMid,
  getMenusMid,
  addMenuMid,
  addEditSchema,
  delMenuMid,
  getDetailMid,
  putMid
} from '@/middleware/system//menu.middleware'
import Menu from '@/model/system/menu.model'
const router = new Router({ prefix: '/system' })

// 查询routers菜单
router.get('/menu/getRouters', auth, conversionMid, getRouterMid, menuCon)

// 查询列表
router.get('/menu/list', auth, getMenusMid, formatHandle, menuCon)

// 新增
router.post('/menu', auth, addEditSchema('add'), addMenuMid, menuCon)

// 删除
router.delete(`/menu/:id`, auth, judgeIdSchema(), delMenuMid, menuCon)

// 获取详细数据
router.get(`/menu/:id`, auth, judgeIdSchema(), getDetailMid, formatHandle, menuCon)

// 修改
router.put('/menu', auth, addEditSchema('put'), putMid, menuCon)

module.exports = router
