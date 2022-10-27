import Joi from 'joi'
import { username, phone } from './common.schema'

export const loginSchema = Joi.object({
  user_name: username,
  password: username
})

export const resetPwdSchema = Joi.object({
  oldPwd: username,
  newPwd: username
})

export const changeUserInfoSchema = Joi.object({
  email: Joi.string().email().required(),
  phonenumber: phone,
  nick_name: Joi.string().min(1).max(10).required(),
  sex: Joi.number()
})
