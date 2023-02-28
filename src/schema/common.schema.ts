// 通用验证方法设置
import Joi from 'joi'

// 用户名称
export const username = Joi.string().min(4).max(11).required()
// 密码判断
export const password = Joi.string().min(4).max(11).required()

// 手机号验证
export const phonenumber = Joi.string()
  .pattern(/^1[3-9]\d{9}$/)
  .allow('')
  .allow(null)

// 用户昵称
export const nickName = Joi.string().min(1).max(10).required()

// 邮箱
export const email = Joi.string().email().allow('').allow(null)

// 性别
export const sex = Joi.number()

// 检测 number
export const checkNum = Joi.number().allow('').allow(null)

// 备注
export const remark = Joi.string().max(200).allow('').allow(null)

// 检查 num数组
export const checkNumArr = Joi.array().items(Joi.number())
