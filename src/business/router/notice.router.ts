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
} from '@/business/middleware/system/notice.middleware'
import { addEditSchema, judgeIdSchema } from '@/business/schema'
import { exportExcelMid } from '@/business/middleware/common/common.middleware'
import SysNotice from '@/mysql/model/system/notice.model'
import { exportExcelSer } from '@/business/service'
import { addJudg, putJudg } from '@/business/schema/system/notice.schema'

const router = new Router({ prefix: '/system' })
// 查询列表
router.get('/notice/list', getListMid, formatHandle, IndexCon())

// 新增
router.post('/notice', addEditSchema(addJudg), getAddMid, IndexCon())

// 删除
router.delete('/notice/:id', judgeIdSchema(), delMid, IndexCon())

// 获取详细数据
router.get('/notice/detail/:id', judgeIdSchema(), getDetailMid, formatHandle, IndexCon())

// 修改
router.put('/notice', addEditSchema(putJudg), putMid, IndexCon())

// 导出列表(excel)
router.post(
  '/notice/export',
  exportExcelMid(exportExcelSer, SysNotice, {
    notice_type: 'sys_notice_type',
    status: 'sys_notice_status'
  }),
  exportMid,
  IndexCon()
)

module.exports = router
