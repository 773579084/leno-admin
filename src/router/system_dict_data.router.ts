/**
 * 字典类型
 */
import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/middleware/formatHandle'
import { judgeIdSchema, verifyMid } from '@/middleware/common.middleware'
import { exportExcelSer } from '@/service/system/dict_data.service'
import IndexCon from '@/controller'
import {
  getListMid,
  getAddMid,
  addSchema,
  getDetailMid,
  putMid,
  getDataTypeMid,
  delMid,
  exportMid
} from '@/middleware/system/dict_data.middleware'
import { exportExcelMid } from '@/middleware/common.middleware'
import DictData from '@/model/system/dict_data.model'
const router = new Router({ prefix: '/system' })

// 查询列表
router.get('/dict/data/list', getListMid, formatHandle, IndexCon())

// 新增
router.post(
  '/dict/data',
  addSchema('add'),
  verifyMid(['dict_value'], DictData),
  getAddMid,
  IndexCon()
)

// 删除
router.delete(`/dict/data/:id`, judgeIdSchema(), delMid, IndexCon())

// 获取详细数据
router.get(`/dict/data/:id`, judgeIdSchema(), getDetailMid, formatHandle, IndexCon())

// 根据字典类型查询字典数据信息
router.get(`/dict/data/type/:dictType`, getDataTypeMid, formatHandle, IndexCon())

// 修改
router.put(
  '/dict/data',
  addSchema('put'),
  verifyMid(['dict_value', 'dict_type'], DictData, 'dict_code'),
  putMid,
  IndexCon()
)

// 导出列表(excel)
router.post(
  '/dict/data/export',
  exportExcelMid(exportExcelSer, { status: 'sys_normal_disable' }),
  exportMid,
  IndexCon()
)

module.exports = router
