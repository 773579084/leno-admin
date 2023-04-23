/**
 * 菜单管理
 */
import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/middleware/formatHandle'
import { judgeIdSchema } from '@/middleware/common.middleware'
import IndexCon from '@/controller'
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
const router = new Router({ prefix: '/system' })

// 查询routers菜单
router.get('/menu/getRouters', conversionMid, getRouterMid, IndexCon())

// 查询列表
router.get('/menu/list', getMenusMid, formatHandle, IndexCon())

// 新增
router.post('/menu', addEditSchema('add'), addMenuMid, IndexCon())

// 删除
router.delete(`/menu/:id`, judgeIdSchema(), delMenuMid, IndexCon())

// 获取详细数据
router.get(`/menu/:id`, judgeIdSchema(), getDetailMid, formatHandle, IndexCon())

// 修改
router.put('/menu', addEditSchema('put'), putMid, IndexCon())

module.exports = router
