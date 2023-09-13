import Router from 'koa-router';
import { formatHandle } from '@/business/middleware/common/common.middleware';
import IndexCon from '@/business/controller';
import { getListMid, getAddMid, getDetailMid, putMid, delMid } from '@/business/middleware/system/dept.middleware';
import { addEditSchema, judgeIdSchema } from '@/business/schema';
import { addJudg, putJudg } from '@/business/schema/system/dept.schema';
import { hasPermi } from '@/business/middleware/common/auth';

const router = new Router({ prefix: '/system' });
// 查询列表
router.get('/dept/list', hasPermi('system:dept:query'), getListMid, formatHandle, IndexCon());

// 新增
router.post('/dept', hasPermi('system:dept:add'), addEditSchema(addJudg), getAddMid, IndexCon());

// 删除
router.delete('/dept/:id', hasPermi('system:dept:remove'), judgeIdSchema(), delMid, IndexCon());

// 获取详细数据
router.get('/dept/detail/:id', hasPermi('system:dept:query'), judgeIdSchema(), getDetailMid, formatHandle, IndexCon());

// 修改
router.put('/dept', hasPermi('system:dept:edit'), addEditSchema(putJudg), putMid, IndexCon());

export default router;
