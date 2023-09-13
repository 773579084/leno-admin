// 此为公用
import Router from 'koa-router';
import IndexCon from '@/business/controller';
import { contrastFileSizeSchema, judImgFormatSchema } from '@/business/schema';
import { commondDelImgMid, commondUploadFilesMid, commondUploadImgMid } from '../middleware/common/common.middleware';

const router = new Router({ prefix: '/common' });

// 公用单张图片上传接口（一般用于上传后及时回显所用）
router.post('/image', contrastFileSizeSchema(), judImgFormatSchema(), commondUploadImgMid, IndexCon('图片上传成功！'));

// 公用删除图片
router.post('/delImage', commondDelImgMid, IndexCon());

// 公用单多文件图片上传（不要求及时回显）
router.post('/files', commondUploadFilesMid, IndexCon());

export default router;
