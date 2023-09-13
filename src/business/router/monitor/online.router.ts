import Router from 'koa-router';
import IndexCon from '@/business/controller';
import { getListMid, delMid } from '@/business/middleware/monitor/online.middleware';
import { hasPermi } from '@/business/middleware/common/auth';

const router = new Router({ prefix: '/monitor' });
// 查询列表
router.get('/online/list', hasPermi('monitor:online:query'), getListMid, IndexCon());

// 删除
router.delete('/online/logout/:id', hasPermi('monitor:online:forceLogout'), delMid, IndexCon());

export default router;
