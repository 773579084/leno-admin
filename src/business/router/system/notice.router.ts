import Router from 'koa-router';
// 格式转换
import { formatHandle } from '@/business/middleware/common/common.middleware';
import IndexCon from '@/business/controller';
import { getListMid, getAddMid, getDetailMid, putMid, delMid } from '@/business/middleware/system/notice.middleware';
import { addEditSchema, judgeIdSchema } from '@/business/schema';
import { addJudg, putJudg } from '@/business/schema/system/notice.schema';
import { hasPermi } from '@/business/middleware/common/auth';

const router = new Router({ prefix: '/system' });
// 查询列表
router.get('/notice/list', hasPermi('system:notice:query	'), getListMid, formatHandle, IndexCon());

// 新增
router.post('/notice', hasPermi('system:notice:add'), addEditSchema(addJudg), getAddMid, IndexCon());

// 删除
router.delete('/notice/:id', hasPermi('system:notice:remove'), judgeIdSchema(), delMid, IndexCon());

// 获取详细数据
router.get('/notice/detail/:id', hasPermi('system:notice:query'), judgeIdSchema(), getDetailMid, formatHandle, IndexCon());

// 修改
router.put('/notice', hasPermi('system:notice:edit'), addEditSchema(putJudg), putMid, IndexCon());

export default router;
