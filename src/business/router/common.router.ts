// 此为公用
import Router from 'koa-router'
import IndexCon from '@/business/controller'
import { contrastFileSizeSchema, judImgFormatSchema } from '@/business/schema'
import {
  commondDelImgMid,
  commondUploadFilesMid,
  commondUploadImgMid
} from '../middleware/common/common.middleware'

const router = new Router({ prefix: '/common' })

// 公用上传图片接口
router.post(
  '/image',
  contrastFileSizeSchema(),
  judImgFormatSchema(),
  commondUploadImgMid,
  IndexCon('图片上传成功！')
)

// 公用删除图片
router.post('/delImage', commondDelImgMid, IndexCon())

// 公用文件上传
router.post('/files', commondUploadFilesMid, IndexCon())

module.exports = router
