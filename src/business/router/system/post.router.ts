import Router from 'koa-router';
// 格式转换
import { formatHandle, exportExcelMid } from '@/business/middleware/common/common.middleware';
import IndexCon from '@/business/controller';
import { getListMid, getAddMid, getDetailMid, putMid, delMid, exportMid } from '@/business/middleware/system/post.middleware';
import { addEditSchema, judgeIdSchema } from '@/business/schema';
import SysPost from '@/mysql/model/system/post.model';
import { exportExcelSer } from '@/business/service';
import { addJudg, putJudg } from '@/business/schema/system/post.schema';
import { hasPermi } from '@/business/middleware/common/auth';

const router = new Router({ prefix: '/system' });
// 查询列表
router.get('/post/list', hasPermi('system:post:query'), getListMid, formatHandle, IndexCon());

// 新增
router.post('/post', hasPermi('system:post:add'), addEditSchema(addJudg), getAddMid, IndexCon());

// 删除
router.delete('/post/:id', hasPermi('system:post:remove'), judgeIdSchema(), delMid, IndexCon());

// 获取详细数据
router.get('/post/detail/:id', hasPermi('system:post:query'), judgeIdSchema(), getDetailMid, formatHandle, IndexCon());

// 修改
router.put('/post', hasPermi('system:post:edit'), addEditSchema(putJudg), putMid, IndexCon());

// 导出列表(excel)
router.post('/post/export', hasPermi('system:post:export'), exportExcelMid(exportExcelSer, SysPost, { status: 'sys_normal_disable' }), exportMid, IndexCon());

export default router;
