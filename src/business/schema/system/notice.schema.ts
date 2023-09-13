import Joi from 'joi';

// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object({
  noticeTitle: Joi.string().required(),
  noticeType: Joi.string().required(),
  noticeContent: Joi.string(),
  imgs: Joi.string().allow(''),
  status: Joi.string(),
});

// 验证编辑信息 nick 必传字符串
export const putJudg = Joi.object({
  noticeId: Joi.number().required(),
  noticeTitle: Joi.string().required(),
  noticeType: Joi.string().required(),
  noticeContent: Joi.string(),
  imgs: Joi.string().allow(''),
  status: Joi.string(),
});
