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
} from '@/business/middleware/system/operlog.middleware'
import { addEditSchema, judgeIdSchema } from '@/business/schema'
import { exportExcelMid } from '@/business/middleware/common/common.middleware'
import SysOperLog from '@/mysql/model/system/operlog.model'
import { exportExcelSer } from '@/business/service'
import { addJudg, putJudg } from '@/business/schema/system/operlog.schema'

const router = new Router({ prefix: '/system' })
// 查询列表
router.get('/operlog/list', getListMid, formatHandle, IndexCon())

// 新增
router.post('/operlog', addEditSchema(addJudg), getAddMid, IndexCon())

// 删除
router.delete('/operlog/:id', judgeIdSchema(), delMid, IndexCon())

// 获取详细数据
router.get('/operlog/detail/:id', judgeIdSchema(), getDetailMid, formatHandle, IndexCon())

// 修改
router.put('/operlog', addEditSchema(putJudg), putMid, IndexCon())

// 导出列表(excel)
router.post(
  '/operlog/export',
  exportExcelMid(exportExcelSer, SysOperLog, {
    business_type: 'sys_oper_type',
    status: 'sys_common_status'
  }),
  exportMid,
  IndexCon()
)

module.exports = router
