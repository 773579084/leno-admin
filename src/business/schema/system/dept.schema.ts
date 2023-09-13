import Joi from 'joi';

// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object({
  deptName: Joi.string().required(),
  orderNum: Joi.number().required(),
  parentId: Joi.number().required(),
  leader: Joi.string(),
  phone: Joi.string(),
  email: Joi.string(),
  status: Joi.string(),
});

// 验证编辑信息 nick 必传字符串
export const putJudg = Joi.object({
  deptId: Joi.number().required(),
  deptName: Joi.string().required(),
  orderNum: Joi.number().required(),
  parentId: Joi.number().required(),
  leader: Joi.string(),
  phone: Joi.string(),
  email: Joi.string(),
  status: Joi.string(),
});
