import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/business/middleware/common/common.middleware'
import IndexCon from '@/business/controller'
import {
  getListMid,
  getAddMid,
  getDetailMid,
  putMid,
  delMid
} from '@/business/middleware/system/dept.middleware'
import { addEditSchema, judgeIdSchema } from '@/business/schema'
import { addJudg, putJudg } from '@/business/schema/system/dept.schema'

const router = new Router({ prefix: '/system' })
// 查询列表
router.get('/dept/list', getListMid, formatHandle, IndexCon())

// 新增
router.post('/dept', addEditSchema(addJudg), getAddMid, IndexCon())

// 删除
router.delete('/dept/:id', judgeIdSchema(), delMid, IndexCon())

// 获取详细数据
router.get('/dept/detail/:id', judgeIdSchema(), getDetailMid, formatHandle, IndexCon())

// 修改
router.put('/dept', addEditSchema(putJudg), putMid, IndexCon())

module.exports = router
