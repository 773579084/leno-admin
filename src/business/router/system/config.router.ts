import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/business/middleware/common/common.middleware'
import IndexCon from '@/business/controller'
import {
  getListMid,
  getAddMid,
  getDetailMid,
  putMid,
  delMid,
  exportMid
} from '@/business/middleware/system/config.middleware'
import { addEditSchema, judgeIdSchema } from '@/business/schema'
import { exportExcelMid } from '@/business/middleware/common/common.middleware'
import SysConfig from '@/mysql/model/system/config.model'
import { exportExcelSer } from '@/business/service'
import { addJudg, putJudg } from '@/business/schema/system/config.schema'

const router = new Router({ prefix: '/system' })
// 查询列表
router.get('/config/list', getListMid, formatHandle, IndexCon())

// 新增
router.post('/config', addEditSchema(addJudg), getAddMid, IndexCon())

// 删除
router.delete('/config/:id', judgeIdSchema(), delMid, IndexCon())

// 获取详细数据
router.get('/config/detail/:id', judgeIdSchema(), getDetailMid, formatHandle, IndexCon())

// 修改
router.put('/config', addEditSchema(putJudg), putMid, IndexCon())

// 导出列表(excel)
router.post(
  '/config/export',
  exportExcelMid(exportExcelSer, SysConfig, { config_type: 'sys_normal_disable' }),
  exportMid,
  IndexCon()
)

module.exports = router
