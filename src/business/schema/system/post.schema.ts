import Joi from 'joi';

// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object({
  postCode: Joi.string().required(),
  postName: Joi.string().required(),
  postSort: Joi.number().required(),
  status: Joi.string(),
  remark: Joi.any(),
});

// 验证编辑信息 nick 必传字符串
export const putJudg = Joi.object({
  postId: Joi.number().required(),
  postCode: Joi.string().required(),
  postName: Joi.string().required(),
  postSort: Joi.number().required(),
  status: Joi.string(),
  remark: Joi.any(),
});
