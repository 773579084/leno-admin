import Joi from 'joi'

// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object({
  })

// 验证编辑信息 nick 必传字符串
export const putJudg = Joi.object({
  operId:Joi.number().required(),
  })