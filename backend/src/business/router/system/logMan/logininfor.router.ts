import Router from 'koa-router';
// 格式转换
import { formatHandle, exportExcelMid } from '@/business/middleware/common/common.middleware';
import IndexCon from '@/business/controller';
import { getListMid, getDetailMid, delMid, exportMid, cleanMid } from '@/business/middleware/system/logininfor.middleware';
import { judgeIdSchema } from '@/business/schema';
import SysLogininfor from '@/mysql/model/system/logininfor.model';
import { exportExcelSer } from '@/business/service';
import { hasPermi } from '@/business/middleware/common/auth';

const router = new Router({ prefix: '/system/logMan' });
// 查询列表
router.get('/logininfor/list', hasPermi('monitor:logininfor:query'), getListMid, formatHandle, IndexCon());

// 清空
router.delete('/logininfor/clean', hasPermi('monitor:logininfor:remove'), cleanMid, IndexCon());

// 删除
router.delete('/logininfor/:id', hasPermi('monitor:logininfor:remove'), judgeIdSchema(), delMid, IndexCon());

// 获取详细数据
router.get('/logininfor/detail/:id', hasPermi('monitor:logininfor:query'), judgeIdSchema(), getDetailMid, formatHandle, IndexCon());

// 导出列表(excel)
router.post(
  '/logininfor/export',
  hasPermi('monitor:logininfor:export'),
  exportExcelMid(
    exportExcelSer,
    SysLogininfor,

    { status: 'sys_common_status' },
  ),
  exportMid,
  IndexCon(),
);

export default router;
