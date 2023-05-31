// 此为公用
import Router from 'koa-router'
import IndexCon from '@/business/controller'
import { updateAvatarMid } from '@/business/middleware/user.middleware'
import { contrastFileSizeSchema, judImgFormatSchema } from '@/business/schema'

const router = new Router({ prefix: '/common' })

// 公用上传图片接口
router.post(
  '/image',
  contrastFileSizeSchema(),
  judImgFormatSchema(),
  updateAvatarMid,
  IndexCon('用户上传头像成功！')
)

module.exports = router
