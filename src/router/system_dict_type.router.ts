/**
 * 字典类型
 */
import Router from 'koa-router'
import auth from '@/middleware/auth.middleware'
// 格式转换
import { formatHandle } from '@/middleware/formatHandle'
import { judgeIdSchema, verifyMid } from '@/middleware/common.middleware'
import { getListSer, exportExcelSer } from '@/service/system/dict_type.service'
import {
  getListCon,
  delUserCon,
  getAddCon,
  getDetailCon,
  putCon,
  exportExcelCon,
  getOptionselectCon
} from '@/controller/system/dict_type.controller'
import {
  getListMid,
  getAddMid,
  addSchema,
  getDetailMid,
  putMid,
  getOptionselectMid
} from '@/middleware/system/dict_type.middleware'
import { exportExcelMid } from '@/middleware/common.middleware'
import DictType from '@/model/system/dict_type.model'
const router = new Router({ prefix: '/system' })

// 查询列表
router.get('/dict/type/list', auth, getListMid, formatHandle, getListCon)

// 获取字典选择框列表
router.get('/dict/type/optionselect', auth, getOptionselectMid, formatHandle, getOptionselectCon)

// 删除
router.delete(`/dict/type/:id`, auth, judgeIdSchema(), delUserCon)

// 新增
router.post(
  '/dict/type',
  auth,
  addSchema('add'),
  verifyMid(['dict_type'], DictType),
  getAddMid,
  getAddCon
)

// 获取详细数据
router.get(`/dict/type/:id`, auth, judgeIdSchema(), getDetailMid, formatHandle, getDetailCon)

// 修改
router.put(
  '/dict/type',
  auth,
  addSchema('put'),
  verifyMid(['dict_type'], DictType, 'dict_id'),
  putMid,
  putCon
)

// 导出列表(excel)
router.post(
  '/dict/type/export',
  auth,
  exportExcelMid(exportExcelSer, { status: 'sys_normal_disable' }),
  exportExcelCon
)

module.exports = router
