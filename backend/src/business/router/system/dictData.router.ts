import Router from 'koa-router';
import { verifyMid, exportExcelMid, formatHandle } from '@/business/middleware/common/common.middleware';
import { exportExcelSer } from '@/business/service';
import IndexCon from '@/business/controller';
import { getListMid, getAddMid, getDetailMid, putMid, getDataTypeMid, delMid, exportMid } from '@/business/middleware/system/dict_data.middleware';
import { addEditSchema, judgeIdSchema } from '@/business/schema';
import SysDictData from '@/mysql/model/system/dict_data.model';
import { addJudg, putJudg } from '@/business/schema/system/sys_dict_data.schema';
import { hasPermi } from '@/business/middleware/common/auth';

const router = new Router({ prefix: '/system' });
// 查询列表
router.get('/dictData/list', hasPermi('system:dictData:list'), getListMid, formatHandle, IndexCon());

// 新增
router.post('/dictData', hasPermi('system:dictData:list'), addEditSchema(addJudg), verifyMid(['dict_value', 'dict_type'], SysDictData), getAddMid, IndexCon());

// 删除
router.delete('/dictData/:id', hasPermi('system:dictData:list'), judgeIdSchema(), delMid, IndexCon());

// 获取详细数据
router.get('/dictData/:id', hasPermi('system:dictData:list'), judgeIdSchema(), getDetailMid, formatHandle, IndexCon());

// 根据字典类型查询字典数据信息
router.get('/dictData/type/:dictType', hasPermi('system:dictData:list'), getDataTypeMid, formatHandle, IndexCon());

// 修改
router.put('/dictData', hasPermi('system:dictData:list'), addEditSchema(putJudg), verifyMid(['dict_value', 'dict_type'], SysDictData, 'dict_code'), putMid, IndexCon());

// 导出列表(excel)
router.post('/dictData/export', hasPermi('system:dictData:list'), exportExcelMid(exportExcelSer, SysDictData, { status: 'sys_normal_disable' }), exportMid, IndexCon());

export default router;
