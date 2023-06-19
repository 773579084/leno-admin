import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/business/middleware/common/common.middleware'
import IndexCon from '@/business/controller'
import { getListMid, delMid, exportMid } from '@/business/middleware/monitor/jobLog.middleware'
import { judgeIdSchema } from '@/business/schema'
import { exportExcelMid } from '@/business/middleware/common/common.middleware'
import MonitorJobLog from '@/mysql/model/monitor/jobLog.model'
import { exportExcelSer } from '@/business/service'
import { hasPermi } from '@/business/middleware/common/auth'

const router = new Router({ prefix: '/monitor' })
// 查询列表
router.get('/jobLog/list', hasPermi('monitor:jobLog:query'), getListMid, formatHandle, IndexCon())

// 删除
router.delete('/jobLog/:id', hasPermi('monitor:jobLog:remove'), judgeIdSchema(), delMid, IndexCon())

// 导出列表(excel)
router.post(
  '/jobLog/export',
  hasPermi('monitor:jobLog:export'),
  exportExcelMid(exportExcelSer, MonitorJobLog, {
    job_group: 'sys_job_group',
    status: 'sys_job_status'
  }),
  exportMid,
  IndexCon()
)

module.exports = router
