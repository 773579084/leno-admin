import Joi from 'joi'

// 验证id
export const userIdSchema = Joi.object({
  userId: Joi.number()
})
