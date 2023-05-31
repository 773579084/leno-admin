import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/business/middleware/common/common.middleware'
import IndexCon from '@/business/controller'
import {
  getListMid,
  getAddMid,
  getDetailMid,
  delMid,
  exportMid
} from '@/business/middleware/system/logininfor.middleware'
import { judgeIdSchema } from '@/business/schema'
import { exportExcelMid } from '@/business/middleware/common/common.middleware'
import SysLogininfor from '@/mysql/model/system/logininfor.model'
import { exportExcelSer } from '@/business/service'

const router = new Router({ prefix: '/system' })
// 查询列表
router.get('/logininfor/list', getListMid, formatHandle, IndexCon())

// 删除
router.delete('/logininfor/:id', judgeIdSchema(), delMid, IndexCon())

// 获取详细数据
router.get('/logininfor/detail/:id', judgeIdSchema(), getDetailMid, formatHandle, IndexCon())

// 导出列表(excel)
router.post(
  '/logininfor/export',
  exportExcelMid(exportExcelSer, SysLogininfor, { status: 'sys_common_status' }),
  exportMid,
  IndexCon()
)

module.exports = router
