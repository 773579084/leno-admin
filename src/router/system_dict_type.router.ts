/**
 * 字典类型
 */
import Router from 'koa-router'
import auth from '@/middleware/auth.middleware'
// 格式转换
import { formatHandle } from '@/middleware/formatHandle'
import { judgeIdSchema, verify } from '@/middleware/common.middleware'
import { getListSer } from '@/service/system/dict_type.service'
import {
  getListCon,
  delUserCon,
  getAddCon,
  getDetailCon,
  putCon,
  exportExcelCon
} from '@/controller/system/dict_type.controller'
import {
  getListMid,
  getAddMid,
  addSchema,
  getDetailMid,
  putMid,
  exportExcelMid
} from '@/middleware/system/dict_type.middleware'
const router = new Router({ prefix: '/system' })

// 查询列表
router.get('/dict/type/list', auth, getListMid, formatHandle, getListCon)

// 删除
router.delete(`/dict/type/:id`, auth, judgeIdSchema(), delUserCon)

// 新增
router.post(
  '/dict/type',
  auth,
  addSchema('add'),
  verify('dict_type', 'dictType', getListSer),
  getAddMid,
  getAddCon
)

// 获取详细数据
router.get(`/dict/type/:id`, auth, judgeIdSchema(), getDetailMid, formatHandle, getDetailCon)

// 修改
router.put('/dict/type', auth, addSchema('put'), putMid, putCon)

// 导出列表(excel)
router.post('/dict/type/export', auth, exportExcelMid, exportExcelCon)

module.exports = router
