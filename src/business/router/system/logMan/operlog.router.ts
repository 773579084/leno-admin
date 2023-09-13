import Router from 'koa-router';
// 格式转换
import { formatHandle, exportExcelMid } from '@/business/middleware/common/common.middleware';
import IndexCon from '@/business/controller';
import { getListMid, getDetailMid, delMid, exportMid, cleanMid } from '@/business/middleware/system/operlog.middleware';
import { judgeIdSchema } from '@/business/schema';
import SysOperLog from '@/mysql/model/system/operlog.model';
import { exportExcelSer } from '@/business/service';
import { hasPermi } from '@/business/middleware/common/auth';

const router = new Router({ prefix: '/system/logMan' });
// 查询列表
router.get('/operlog/list', hasPermi('monitor:operlog:query'), getListMid, formatHandle, IndexCon());

// 清空
router.delete('/operlog/clean', hasPermi('monitor:operlog:remove'), cleanMid, IndexCon());

// 删除
router.delete('/operlog/:id', hasPermi('monitor:operlog:remove'), judgeIdSchema(), delMid, IndexCon());

// 获取详细数据
router.get('/operlog/detail/:id', hasPermi('monitor:operlog:query'), judgeIdSchema(), getDetailMid, formatHandle, IndexCon());

// 导出列表(excel)
router.post(
  '/operlog/export',
  hasPermi('monitor:operlog:export'),
  exportExcelMid(exportExcelSer, SysOperLog, {
    business_type: 'sys_oper_type',
    status: 'sys_common_status',
  }),
  exportMid,
  IndexCon(),
);

export default router;
