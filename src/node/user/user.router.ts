import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/business/middleware/common/common.middleware'
import { exportExcelSer } from '@/business/service'
import IndexCon from '@/business/controller'
import {
  getListMid,
  getAddMid,
  getDetailMid,
  putMid,
  delMid,
  exportMid
} from '@/business/middleware/system/user.middleware'
import { addEditSchema, judgeIdSchema } from '@/business/schema'
import { exportExcelMid } from '@/business/middleware/common/common.middleware'
import LenoUser from '@/mysql/model/system/user.model'
import { addJudg, putJudg } from '@/business/schema/system/user.schema'

const router = new Router({ prefix: '/system' })
// 查询列表
router.get('/user/list', getListMid, formatHandle, IndexCon())

// 新增
router.post(
  '/user',
  addEditSchema(addJudg),
  getAddMid,
  IndexCon()
)

// 删除
router.delete('/user/:id', judgeIdSchema(), delMid, IndexCon())

// 获取详细数据
router.get('/user/:id', judgeIdSchema(), getDetailMid, formatHandle, IndexCon())

// 修改
router.put(
  '/user',
  addEditSchema(putJudg),
  putMid,
  IndexCon()
)

// 导出列表(excel)
router.post(
  '/user/export',
  exportExcelMid(exportExcelSer, LenoUser, {"user_id":"sys_show_hide","dept_id":"sys_normal_disable","user_type":"sys_show_hide","email":"sys_normal_disable"}),
  exportMid,
  IndexCon()
)

module.exports = router