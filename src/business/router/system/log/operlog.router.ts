import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/business/middleware/common/common.middleware'
import IndexCon from '@/business/controller'
import {
  getListMid,
  getDetailMid,
  delMid,
  exportMid
} from '@/business/middleware/system/operlog.middleware'
import { judgeIdSchema } from '@/business/schema'
import { exportExcelMid } from '@/business/middleware/common/common.middleware'
import SysOperLog from '@/mysql/model/system/operlog.model'
import { exportExcelSer } from '@/business/service'

const router = new Router({ prefix: '/system' })
// 查询列表
router.get('/operlog/list', getListMid, formatHandle, IndexCon())

// 删除
router.delete('/operlog/:id', judgeIdSchema(), delMid, IndexCon())

// 获取详细数据
router.get('/operlog/detail/:id', judgeIdSchema(), getDetailMid, formatHandle, IndexCon())

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
