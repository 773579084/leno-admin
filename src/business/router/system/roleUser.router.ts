import Router from 'koa-router';
// 格式转换
import { formatHandle } from '@/business/middleware/common/common.middleware';
import IndexCon from '@/business/controller';
import { getListMid, getAddMid, delMid, unallocatedListMid } from '@/business/middleware/system/roleUser.middleware';
import { hasPermi } from '@/business/middleware/common/auth';

const router = new Router({ prefix: '/system' });
// 查询列表
router.get('/roleUser/list', hasPermi('system:roleUser:list'), getListMid, formatHandle, IndexCon());

// 新增 用户与角色关系
router.post('/roleUser/authorization', hasPermi('system:roleUser:list'), getAddMid, IndexCon());

// 取消授权
router.delete('/roleUser/authorization', hasPermi('system:roleUser:list'), delMid, IndexCon('取消授权'));

// 选择用户列表
router.get('/roleUser/unallocatedList', hasPermi('system:roleUser:list'), unallocatedListMid, formatHandle, IndexCon());

export default router;
