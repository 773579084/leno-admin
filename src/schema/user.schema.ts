import Joi from 'joi'
import { username, phonenumber, nickName, email, sex, password } from './common.schema'

export const loginSchema = Joi.object({
  userName: username,
  password
})

export const resetPwdSchema = Joi.object({
  oldPwd: username,
  newPwd: password
})

export const changeUserInfoSchema = Joi.object({
  email: email.required(),
  phonenumber: phonenumber.required(),
  nickName,
  sex
})
