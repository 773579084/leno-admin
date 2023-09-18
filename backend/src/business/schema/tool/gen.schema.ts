import Joi from 'joi';
import { remark, requireString, mustId, arrayNoNull, anySche } from '../config.schema';

export const putJudg = Joi.object({
  tableId: mustId,
  tableName: requireString,
  tableComment: requireString,
  className: requireString,
  functionAuthor: requireString,
  tplCategory: requireString,
  packageName: requireString,
  moduleName: requireString,
  businessName: requireString,
  functionName: requireString,
  columns: arrayNoNull,
  remark,
  options: remark,
  genType: remark,
  genPath: remark,
  treeCode: remark,
  treeParentCode: remark,
  treeName: remark,
  subTableName: remark,
  subTableFkName: anySche,
  parentId: anySche,
});
