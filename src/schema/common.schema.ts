// 通用验证方法设置
import Joi from 'joi'

// 登录注册账号类验证
export const username = Joi.string().min(4).max(11).required()

// 手机号验证
export const phone = Joi.string()
  .pattern(/^1[3-9]\d{9}$/)
  .required()
