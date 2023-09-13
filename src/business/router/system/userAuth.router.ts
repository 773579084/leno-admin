import Router from 'koa-router';
import IndexCon from '@/business/controller';
import { getAddMid, getListMid } from '@/business/middleware/system/userAuth.middleware';
import { hasPermi } from '@/business/middleware/common/auth';
import { formatHandle } from '@/business/middleware/common/common.middleware';

const router = new Router({ prefix: '/system' });

// 查询列表
router.get('/userAuth/role/list', hasPermi('system:role:query'), getListMid, formatHandle, IndexCon());

// 设置 用户 角色信息
router.put('/user/userAuth', hasPermi('system:userAuth:list'), getAddMid, IndexCon('授权成功'));

export default router;
