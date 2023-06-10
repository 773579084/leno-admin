import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/business/middleware/common/common.middleware'
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
import SysDictType from '@/mysql/model/system/dict_type.model'
import { addJudg, putJudg } from '../../schema/system/sys_dict_type.schema'
import { hasPermi } from '@/business/middleware/common/auth'

const router = new Router({ prefix: '/system' })
// 查询列表
router.get('/dict/type/list', hasPermi('system:dict:query'), getListMid, formatHandle, IndexCon())

// 获取字典选择框列表
router.get(
  '/dict/type/optionselect',
  hasPermi('system:dict:query'),
  getOptionselectMid,
  formatHandle,
  IndexCon()
)

// 删除
router.delete(`/dict/type/:id`, hasPermi('system:dict:remove'), judgeIdSchema(), delMid, IndexCon())

// 新增
router.post(
  '/dict/type',
  hasPermi('system:dict:add'),
  addEditSchema(addJudg),
  verifyMid(['dict_type'], SysDictType),
  getAddMid,
  IndexCon()
)

// 获取详细数据
router.get(
  `/dict/type/:id`,
  hasPermi('system:dict:query'),
  judgeIdSchema(),
  getDetailMid,
  formatHandle,
  IndexCon()
)

// 修改
router.put(
  '/dict/type',
  hasPermi('system:dict:edit'),
  addEditSchema(putJudg),
  verifyMid(['dict_type'], SysDictType, 'dict_id'),
  putMid,
  IndexCon()
)

// 导出列表(excel)
router.post(
  '/dict/type/export',
  hasPermi('system:dict:export'),
  exportExcelMid(exportExcelSer, SysDictType, { status: 'sys_normal_disable' }),
  exportMid,
  IndexCon()
)

module.exports = router
