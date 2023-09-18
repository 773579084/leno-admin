import Router from 'koa-router';
import { formatHandle } from '@/business/middleware/common/common.middleware';
import IndexCon from '@/business/controller';
import { getMenusMid, addMenuMid, delMenuMid, getDetailMid, putMid } from '@/business/middleware/system/menu.middleware';
import { judgeIdSchema, addEditSchema } from '@/business/schema';
import { hasPermi } from '@/business/middleware/common/auth';
import { addJudg, putJudg } from '../../schema/system/sys_menus.schema';

const router = new Router({ prefix: '/system' });

// 获取角色权限过滤后的菜单列表
router.get('/menu/list', hasPermi('system:menu:query'), getMenusMid, formatHandle, IndexCon());

// 新增
router.post('/menu', hasPermi('system:menu:add'), addEditSchema(addJudg), addMenuMid, IndexCon());

// 删除
router.delete('/menu/:id', hasPermi('system:menu:remove'), judgeIdSchema(), delMenuMid, IndexCon());

// 获取详细数据
router.get('/menu/:id', hasPermi('system:menu:query'), judgeIdSchema(), getDetailMid, formatHandle, IndexCon());

// 修改
router.put('/menu', hasPermi('system:menu:edit'), addEditSchema(putJudg), putMid, IndexCon());

export default router;
