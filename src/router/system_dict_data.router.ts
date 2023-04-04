/**
 * 字典类型
 */
import Router from 'koa-router'
import auth from '@/middleware/auth.middleware'
// 格式转换
import { formatHandle } from '@/middleware/formatHandle'
import { judgeIdSchema, verify } from '@/middleware/common.middleware'
import { getListSer } from '@/service/system/dict_data.service'
import {
  getListCon,
  delUserCon,
  getAddCon,
  getDetailCon,
  putCon,
  exportExcelCon
} from '@/controller/system/dict_data.controller'
import {
  getListMid,
  getAddMid,
  addSchema,
  getDetailMid,
  putMid,
  exportExcelMid,
  getDataTypeMid
} from '@/middleware/system/dict_data.middleware'
const router = new Router({ prefix: '/system' })

// 查询列表
router.get('/dict/data/list', auth, getListMid, formatHandle, getListCon)

// 删除
router.delete(`/dict/data/:id`, auth, judgeIdSchema(), delUserCon)

// 新增
router.post('/dict/data', auth, addSchema('add'), getAddMid, getAddCon)

// 获取详细数据
router.get(`/dict/data/:id`, auth, judgeIdSchema(), getDetailMid, formatHandle, getDetailCon)

// 根据字典类型查询字典数据信息
router.get(`/dict/data/type/:dictType`, auth, getDataTypeMid, formatHandle, getDetailCon)

// 修改
router.put('/dict/data', auth, addSchema('put'), putMid, putCon)

// 导出列表(excel)
router.post('/dict/data/export', auth, exportExcelMid, exportExcelCon)

module.exports = router
