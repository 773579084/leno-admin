import Joi from 'joi'

// 验证新增信息 nick 必传字符串
export const addJudg = Joi.object({
  userId: Joi.number().required(),
  deptId: Joi.number(),
  userName: Joi.string(),
  nickName: Joi.string(),
  })

// 验证编辑信息 nick 必传字符串
export const putJudg = Joi.object({
  userId: Joi.number().required(),
  userType: Joi.string(),
  email: Joi.string(),
  phonenumber: Joi.string(),
  sex: Joi.string(),
  })