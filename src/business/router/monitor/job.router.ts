import Router from 'koa-router';
// 格式转换
import IndexCon from '@/business/controller';
import { getListMid, getAddMid, getDetailMid, putMid, delMid, exportMid, putRoleStatusMid, jobRunOneMid } from '@/business/middleware/monitor/job.middleware';
import { addEditSchema, judgeIdSchema } from '@/business/schema';
import { exportExcelMid, formatHandle } from '@/business/middleware/common/common.middleware';
import MonitorJob from '@/mysql/model/monitor/job.model';
import { exportExcelSer } from '@/business/service';
import { addJudg, putJudg } from '@/business/schema/monitor/job.schema';
import { hasPermi } from '@/business/middleware/common/auth';

const router = new Router({ prefix: '/monitor' });
// 查询列表
router.get('/job/list', hasPermi('monitor:job:query'), getListMid, formatHandle, IndexCon());

// 新增
router.post('/job', hasPermi('monitor:job:add'), addEditSchema(addJudg), getAddMid, IndexCon());

// 删除
router.delete('/job/:id', hasPermi('monitor:job:remove'), judgeIdSchema(), delMid, IndexCon());

// 获取详细数据
router.get('/job/detail/:id', hasPermi('monitor:job:query'), judgeIdSchema(), getDetailMid, formatHandle, IndexCon());

// 修改状态(是否启动定时任务)
router.put('/job/status', hasPermi('monitor:job:edit'), putRoleStatusMid, IndexCon());

// 修改
router.put('/job', hasPermi('monitor:job:edit'), addEditSchema(putJudg), putMid, IndexCon());

// 立即执行一次
router.put('/job/run', hasPermi('monitor:job:edit'), jobRunOneMid, IndexCon('执行成功'));

// 导出列表(excel)
router.post(
  '/job/export',
  hasPermi('monitor:job:export'),
  exportExcelMid(exportExcelSer, MonitorJob, {
    job_group: 'sys_job_group',
    status: 'sys_job_status',
  }),
  exportMid,
  IndexCon(),
);

export default router;
