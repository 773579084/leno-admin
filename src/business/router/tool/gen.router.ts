import Router from 'koa-router';
// 格式转换
import { formatHandle } from '@/business/middleware/common/common.middleware';
import {
  findAllSqlMid,
  getListMid,
  getAddMid,
  putMid,
  delMid,
  importTableMid,
  getListDbMid,
  getListSqlMid,
  codePreviewMid,
  genCodeMid,
  batchGenCodeMid,
} from '@/business/middleware/tool/gen.middleware';
import { judgeIdSchema, addEditSchema } from '@/business/schema';
import IndexCon from '@/business/controller';
import { putJudg } from '@/business/schema/tool/gen.schema';
import { hasPermi } from '@/business/middleware/common/auth';

const router = new Router({ prefix: '/tool' });

// 查询数据库未导入的表
router.get('/gen/db/list', hasPermi('tool:gen:query'), findAllSqlMid, getListDbMid, formatHandle, IndexCon());

// 导入表
router.post('/gen/import/:tables', hasPermi('tool:gen:import'), importTableMid, IndexCon());

// 查询列表
router.get('/gen/list', hasPermi('tool:gen:query'), getListMid, formatHandle, IndexCon());

// 查询所有sql表及字段名
router.get('/gen/sql/list', hasPermi('tool:gen:query'), getListSqlMid, formatHandle, IndexCon());

// 删除
router.delete('/gen/del/:id', hasPermi('tool:gen:remove'), judgeIdSchema(), delMid, IndexCon());

// 导入生成表模板
router.post('/gen/import/:tables', hasPermi('tool:gen:import'), getAddMid, IndexCon());

// 修改
router.put('/gen', hasPermi('tool:genEdit:list'), addEditSchema(putJudg), putMid, IndexCon());

// 代码预览
router.get('/gen/preview/:id', hasPermi('tool:gen:preview'), judgeIdSchema(), codePreviewMid, IndexCon());

// 生成代码（压缩包）
router.post('/gen/batchGenCode/generatedCode/:ids', hasPermi('tool:gen:code'), judgeIdSchema(), batchGenCodeMid, IndexCon());

// 生成代码（写到指定文件夹）
router.post('/gen/genCode/generatedCode/:ids', hasPermi('tool:gen:code'), judgeIdSchema(), genCodeMid, IndexCon());

export default router;
