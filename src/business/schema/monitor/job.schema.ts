import Joi from 'joi';

// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object({
  concurrent: Joi.string().allow(''),
  cronExpression: Joi.string().required(),
  invokeTarget: Joi.string().required(),
  jobGroup: Joi.string().allow(''),
  jobName: Joi.string().required(),
  misfirePolicy: Joi.string().allow(''),
  status: Joi.string().allow(''),
});

// 验证编辑信息 nick 必传字符串
export const putJudg = Joi.object({
  jobId: Joi.number().required(),
  concurrent: Joi.string().allow(''),
  cronExpression: Joi.string().required(),
  invokeTarget: Joi.string().required(),
  jobGroup: Joi.string().allow(''),
  jobName: Joi.string().required(),
  misfirePolicy: Joi.string().allow(''),
  status: Joi.string().allow(''),
});
