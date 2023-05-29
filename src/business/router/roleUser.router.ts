import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/business/middleware/common/common.middleware'
import IndexCon from '@/business/controller'
import {
  getListMid,
  getAddMid,
  delMid,
  unallocatedListMid
} from '@/business/middleware/system/roleUser.middleware'
import { judgeIdSchema } from '@/business/schema'

const router = new Router({ prefix: '/system' })
// 查询列表
router.get('/roleUser/list', getListMid, formatHandle, IndexCon())

// 新增 用户与角色关系
router.post('/roleUser', getAddMid, IndexCon())

// 取消授权
router.delete('/roleUser/:id', judgeIdSchema(), delMid, IndexCon())

// 选择用户列表
router.get('/roleUser/unallocatedList', unallocatedListMid, formatHandle, IndexCon())

module.exports = router