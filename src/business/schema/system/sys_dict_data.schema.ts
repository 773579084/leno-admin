import Joi from 'joi';
import { remark, dictString, mustId, requireString } from '../config.schema';

const addEdit = {
  dictSort: mustId,
  dictLabel: requireString,
  dictValue: requireString,
  dictType: dictString,
  cssClass: dictString,
  listClass: dictString,
  status: dictString,
  remark,
};

// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object(addEdit);

// 验证新增信息 nick 必传字符串
export const putJudg = Joi.object({
  dictCode: mustId,
  ...addEdit,
});
