import Joi from 'joi';
import { remark, requireString, dictString, mustId } from '../config.schema';

const addEdit = {
  dictName: requireString,
  dictType: requireString,
  status: dictString,
  remark,
};
// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object(addEdit);

// 验证新增信息 nick 必传字符串
export const putJudg = Joi.object({
  dictId: mustId,
  ...addEdit,
});
