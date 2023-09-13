import Joi from 'joi';

// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object({
  roleName: Joi.string().required(),
  roleKey: Joi.string().required(),
  status: Joi.string().required(),
  roleSort: Joi.number().required(),
  menuIds: Joi.array(),
  remark: Joi.any(),
});

// 验证编辑信息 nick 必传字符串
export const putJudg = Joi.object({
  roleId: Joi.number().required(),
  roleName: Joi.string().required(),
  roleKey: Joi.string().required(),
  roleSort: Joi.number().required(),
  status: Joi.string().required(),
  menuIds: Joi.array(),
  remark: Joi.any(),
});
