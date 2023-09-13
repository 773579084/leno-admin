import Joi from 'joi';

// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object({
  configName: Joi.string().required(),
  configKey: Joi.string().required(),
  configValue: Joi.string().required(),
  configType: Joi.string(),
  remark: Joi.string(),
});

// 验证编辑信息 nick 必传字符串
export const putJudg = Joi.object({
  configId: Joi.number().required(),
  configName: Joi.string().required(),
  configKey: Joi.string().required(),
  configValue: Joi.string().required(),
  configType: Joi.string(),
  files: Joi.string().allow(''),
  remark: Joi.any(),
});
