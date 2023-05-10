/**
 * 字典类型
 */
import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/business/middleware/common/common.middleware'
import { verifyMid } from '@/business/middleware/common/common.middleware'
import {
  findAllSqlMid,
  getListMid,
  getAddMid,
  putMid,
  delMid
} from '@/business/middleware/tool/gen.middleware'
import { judgeIdSchema, addEditSchema } from '@/business/schema'
import IndexCon from '@/business/controller'
import { addJudg, putJudg } from '@/business/schema/tool/gen.schema'
import ToolGen from '@/mysql/model/tool/gen.model'

const router = new Router({ prefix: '/tool' })
// 查询列表
router.get('/gen/list', findAllSqlMid, getListMid, formatHandle, IndexCon())

// 新增
router.post(
  '/gen/add',
  addEditSchema(addJudg),
  verifyMid(['table_name', 'class_name'], ToolGen),
  getAddMid,
  IndexCon()
)

// 删除
router.delete(`/gen/del/:id`, judgeIdSchema(), delMid, IndexCon())

// 导入生成表模板
router.post('/gen/importTable/:tables', getAddMid, IndexCon())

// // 修改
// router.put(
//   '/dict/type',
//   addEditSchema(putJudg),
//   verifyMid(['dict_type'], SysDictType, 'dict_id'),
//   putMid,
//   IndexCon()
// )

module.exports = router
