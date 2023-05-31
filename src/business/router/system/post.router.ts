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
} from '@/business/middleware/system/post.middleware'
import { addEditSchema, judgeIdSchema } from '@/business/schema'
import { exportExcelMid } from '@/business/middleware/common/common.middleware'
import SysPost from '@/mysql/model/system/post.model'
import { exportExcelSer } from '@/business/service'
import { addJudg, putJudg } from '@/business/schema/system/post.schema'

const router = new Router({ prefix: '/system' })
// 查询列表
router.get('/post/list', getListMid, formatHandle, IndexCon())

// 新增
router.post('/post', addEditSchema(addJudg), getAddMid, IndexCon())

// 删除
router.delete('/post/:id', judgeIdSchema(), delMid, IndexCon())

// 获取详细数据
router.get('/post/detail/:id', judgeIdSchema(), getDetailMid, formatHandle, IndexCon())

// 修改
router.put('/post', addEditSchema(putJudg), putMid, IndexCon())

// 导出列表(excel)
router.post(
  '/post/export',
  exportExcelMid(exportExcelSer, SysPost, { status: 'sys_normal_disable' }),
  exportMid,
  IndexCon()
)

module.exports = router
