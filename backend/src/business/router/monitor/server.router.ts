import Router from 'koa-router';
import IndexCon from '@/business/controller';
import getListMid from '@/business/middleware/monitor/server.middleware';
import { hasPermi } from '@/business/middleware/common/auth';

const router = new Router({ prefix: '/monitor' });
// 查询列表
router.get('/server/list', hasPermi('monitor:server:query'), getListMid, IndexCon());

export default router;
