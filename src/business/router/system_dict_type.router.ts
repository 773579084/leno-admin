/**
 * 字典类型
 */
import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/business/middleware/common/formatHandle'
import { verifyMid } from '@/business/middleware/common/common.middleware'
import { exportExcelSer } from '@/business/service'
import {
  getListMid,
  getAddMid,
  getDetailMid,
  putMid,
  getOptionselectMid,
  delMid,
  exportMid
} from '@/business/middleware/system/dict_type.middleware'
import { exportExcelMid } from '@/business/middleware/common/common.middleware'
import { judgeIdSchema, addEditSchema } from '@/business/schema'
import IndexCon from '@/business/controller'
import DictType from '@/mysql/model/system/dict_type.model'
import { addJudg, putJudg } from '../schema/system/sys_dict_type.schema'

const router = new Router({ prefix: '/system' })
// 查询列表
router.get('/dict/type/list', getListMid, formatHandle, IndexCon())

// 获取字典选择框列表
router.get('/dict/type/optionselect', getOptionselectMid, formatHandle, IndexCon())

// 删除
router.delete(`/dict/type/:id`, judgeIdSchema(), delMid, IndexCon())

// 新增
router.post(
  '/dict/type',
  addEditSchema(addJudg),
  verifyMid(['dict_type'], DictType),
  getAddMid,
  IndexCon()
)

// 获取详细数据
router.get(`/dict/type/:id`, judgeIdSchema(), getDetailMid, formatHandle, IndexCon())

// 修改
router.put(
  '/dict/type',
  addEditSchema(putJudg),
  verifyMid(['dict_type'], DictType, 'dict_id'),
  putMid,
  IndexCon()
)

// 导出列表(excel)
router.post(
  '/dict/type/export',
  exportExcelMid(exportExcelSer, DictType, { status: 'sys_normal_disable' }),
  exportMid,
  IndexCon()
)

module.exports = router
