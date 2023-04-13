/**
 * 字典类型
 */
import Router from 'koa-router'
import auth from '@/middleware/auth.middleware'
// 格式转换
import { formatHandle } from '@/middleware/formatHandle'
import { judgeIdSchema, verifyMid } from '@/middleware/common.middleware'
import { getRoutersCon } from '@/controller/system/menu.controller'
import { getRouterMid, conversionMid } from '@/middleware/system//menu.middleware'
import DictData from '@/model/system/dict_data.model'
const router = new Router({ prefix: '/system' })

// 查询routers菜单
router.get('/menu/getRouters', auth, conversionMid, getRouterMid, getRoutersCon)

// // 查询列表
// router.get('/dict/data/list', auth, getListMid, formatHandle, getListCon)

// // 删除
// router.delete(`/dict/data/:id`, auth, judgeIdSchema(), delUserCon)

// // 新增
// router.post(
//   '/dict/data',
//   auth,
//   addSchema('add'),
//   verifyMid(['dict_value'], DictData),
//   getAddMid,
//   getAddCon
// )

// // 获取详细数据
// router.get(`/dict/data/:id`, auth, judgeIdSchema(), getDetailMid, formatHandle, getDetailCon)

// // 根据字典类型查询字典数据信息
// router.get(`/dict/data/type/:dictType`, auth, getDataTypeMid, formatHandle, getDetailCon)

// // 修改
// router.put(
//   '/dict/data',
//   auth,
//   addSchema('put'),
//   verifyMid(['dict_value', 'dict_type'], DictData, 'dict_code'),
//   putMid,
//   putCon
// )

module.exports = router
