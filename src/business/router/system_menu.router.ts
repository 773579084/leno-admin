/**
 * 菜单管理
 */
import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/business/middleware/common/formatHandle'
import IndexCon from '@/business/controller'
import {
  getRouterMid,
  conversionMid,
  getMenusMid,
  addMenuMid,
  delMenuMid,
  getDetailMid,
  putMid
} from '@/business/middleware/system/menu.middleware'
import { judgeIdSchema, addEditSchema } from '@/business/schema'
import { addJudg, putJudg } from '../schema/system/sys_menus.schema'

const router = new Router({ prefix: '/system' })
// 查询routers菜单
router.get('/menu/getRouters', conversionMid, getRouterMid, IndexCon())

// 查询列表
router.get('/menu/list', getMenusMid, formatHandle, IndexCon())

// 新增
router.post('/menu', addEditSchema(addJudg), addMenuMid, IndexCon())

// 删除
router.delete(`/menu/:id`, judgeIdSchema(), delMenuMid, IndexCon())

// 获取详细数据
router.get(`/menu/:id`, judgeIdSchema(), getDetailMid, formatHandle, IndexCon())

// 修改
router.put('/menu', addEditSchema(putJudg), putMid, IndexCon())

module.exports = router
