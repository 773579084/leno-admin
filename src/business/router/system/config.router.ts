import Router from 'koa-router';
import { formatHandle, exportExcelMid } from '@/business/middleware/common/common.middleware';
import IndexCon from '@/business/controller';
import { getListMid, getAddMid, getDetailMid, putMid, delMid, exportMid, getConfigKeyMid } from '@/business/middleware/system/config.middleware';
import { addEditSchema, judgeIdSchema } from '@/business/schema';
import SysConfig from '@/mysql/model/system/config.model';
import { exportExcelSer } from '@/business/service';
import { addJudg, putJudg } from '@/business/schema/system/config.schema';
import { hasPermi } from '@/business/middleware/common/auth';

const router = new Router({ prefix: '/system' });
// 查询列表
router.get('/config/list', hasPermi('system:config:query'), getListMid, formatHandle, IndexCon());

// 根据参数键名查询参数值
router.post('/config/configKey', getConfigKeyMid, IndexCon());

// 新增
router.post('/config', hasPermi('system:config:add'), addEditSchema(addJudg), getAddMid, IndexCon());

// 删除
router.delete('/config/:id', hasPermi('system:config:remove'), judgeIdSchema(), delMid, IndexCon());

// 获取详细数据
router.get('/config/detail/:id', hasPermi('system:config:query'), judgeIdSchema(), getDetailMid, formatHandle, IndexCon());

// 修改
router.put('/config', hasPermi('system:config:edit'), addEditSchema(putJudg), putMid, IndexCon());

// 导出列表(excel)
router.post('/config/export', hasPermi('system:config:export'), exportExcelMid(exportExcelSer, SysConfig, { config_type: 'sys_yes_no' }), exportMid, IndexCon());

export default router;
