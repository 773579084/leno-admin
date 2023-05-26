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
  exportMid,
  putRoleStatusMid
} from '@/business/middleware/system/role.middleware'
import { addEditSchema, judgeIdSchema } from '@/business/schema'
import { exportExcelMid } from '@/business/middleware/common/common.middleware'
import SysRole from '@/mysql/model/system/role.model'
import { addJudg, putJudg } from '@/business/schema/system/role.schema'

const router = new Router({ prefix: '/system' })
// 查询列表
router.get('/role/list', getListMid, formatHandle, IndexCon())

// 新增
router.post('/role', addEditSchema(addJudg), getAddMid, IndexCon())

// 删除
router.delete('/role/:id', judgeIdSchema(), delMid, IndexCon())

// 获取详细数据
router.get('/role/:id', judgeIdSchema(), getDetailMid, formatHandle, IndexCon())

// 修改
router.put('/role', addEditSchema(putJudg), putMid, IndexCon())

// 修改角色状态
router.put('/role/status', putRoleStatusMid, IndexCon())

// 导出列表(excel)
router.post(
  '/role/export',
  exportExcelMid(exportExcelSer, SysRole, { status: 'sys_normal_disable' }),
  exportMid,
  IndexCon()
)

module.exports = router
