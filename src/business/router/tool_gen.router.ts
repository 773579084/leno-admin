import Router from 'koa-router'
// 格式转换
import { formatHandle } from '@/business/middleware/common/common.middleware'
import {
  findAllSqlMid,
  getListMid,
  getAddMid,
  putMid,
  delMid,
  importTableMid,
  getListDbMid,
  getListSqlMid,
  codePreviewMid,
  genCodeMid,
  batchGenCodeMid
} from '@/business/middleware/tool/gen.middleware'
import { judgeIdSchema, addEditSchema } from '@/business/schema'
import IndexCon from '@/business/controller'
import { putJudg } from '@/business/schema/tool/gen.schema'

const router = new Router({ prefix: '/tool' })

// 查询数据库存在的表
router.get('/gen/db/list', findAllSqlMid, getListDbMid, formatHandle, IndexCon())

// 导入表
router.post('/gen/importTable/:tables', importTableMid, IndexCon())

// 查询列表
router.get('/gen/list', getListMid, formatHandle, IndexCon())

// 查询所有sql表及字段名
router.get('/gen/sql/list', getListSqlMid, formatHandle, IndexCon())

// 删除
router.delete(`/gen/del/:id`, judgeIdSchema(), delMid, IndexCon())

// 导入生成表模板
router.post('/gen/importTable/:tables', getAddMid, IndexCon())

// 修改
router.put('/gen', addEditSchema(putJudg), putMid, IndexCon())

// 代码预览
router.get('/gen/preview/:id', judgeIdSchema(), codePreviewMid, IndexCon())

// 生成代码（压缩包）
router.get('/gen/batchGenCode/:ids', judgeIdSchema(), batchGenCodeMid, IndexCon())

// 生成代码（写到指定文件夹）
router.get('/gen/genCode/:ids', judgeIdSchema(), genCodeMid, IndexCon())

module.exports = router
