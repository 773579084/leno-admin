/**
 * 字典类型
 */
import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/business/middleware/common/formatHandle'
import { verifyMid } from '@/business/middleware/common/common.middleware'
import { exportExcelSer } from '@/business/service'
import IndexCon from '@/business/controller'
import {
  getListMid,
  getAddMid,
  getDetailMid,
  putMid,
  getDataTypeMid,
  delMid,
  exportMid
} from '@/business/middleware/system/dict_data.middleware'
import { addEditSchema, judgeIdSchema } from '@/business/schema'
import { exportExcelMid } from '@/business/middleware/common/common.middleware'
import DictData from '@/mysql/model/system/dict_data.model'
import { addJudg, putJudg } from '@/business/schema/system/sys_dict_data.schema'

const router = new Router({ prefix: '/system' })
// 查询列表
router.get('/dict/data/list', getListMid, formatHandle, IndexCon())

// 新增
router.post(
  '/dict/data',
  addEditSchema(addJudg),
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
  addEditSchema(putJudg),
  verifyMid(['dict_value', 'dict_type'], DictData, 'dict_code'),
  putMid,
  IndexCon()
)

// 导出列表(excel)
router.post(
  '/dict/data/export',
  exportExcelMid(exportExcelSer, DictData, { status: 'sys_normal_disable' }),
  exportMid,
  IndexCon()
)

module.exports = router
