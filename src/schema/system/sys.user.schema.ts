import Joi from 'joi'

// 验证id
export const userIdJudge = Joi.object({
  userId: Joi.number()
})
