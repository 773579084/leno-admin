import Joi from 'joi';
import { Context } from 'koa';
import { pwdType, userType } from '@/types';
import errors from '@/app/err.type';
import { username, phonenumber, nickName, email, dictString, password } from './config.schema';

const { FormatWrongErr } = errors;

export const loginSchema = Joi.object({
  userName: username,
  password,
});

export const resetPwdSchema = Joi.object({
  oldPwd: username,
  newPwd: password,
});

export const changeUserInfoSchema = Joi.object({
  email: email.required(),
  phonenumber: phonenumber.required(),
  nickName,
  sex: dictString,
});

// 判断用户名与密码是否为空
export const userSchema = async (ctx: Context, next: () => Promise<void>) => {
  const { userName, password: pwd } = ctx.request.body as userType;

  try {
    await loginSchema.validateAsync({ userName, password: pwd });
  } catch (error) {
    console.error('用户名或密码格式错误!', ctx.request.body);
    return ctx.app.emit('error', FormatWrongErr, ctx);
  }
  await next();
};

// 判断新旧密码 格式是否正确
export const pwdSchema = async (ctx: Context, next: () => Promise<void>) => {
  const { oldPwd, newPwd } = ctx.request.body as pwdType;

  try {
    await resetPwdSchema.validateAsync({ oldPwd, newPwd });
  } catch (error) {
    console.error('账号密码格式不对!', ctx.request.body);
    return ctx.app.emit('error', FormatWrongErr, ctx);
  }
  await next();
};

// 检查 用户昵称 手机号码 邮箱 是否为空
export const userInfoSchema = async (ctx: Context, next: () => Promise<void>) => {
  const { email: em, phonenumber: ph, nickName: nkn, sex = 0 } = ctx.request.body as userType;

  try {
    await changeUserInfoSchema.validateAsync({
      email: em,
      phonenumber: ph,
      nickName: nkn,
      sex,
    });
  } catch (error) {
    console.error('用户昵称、手机号码或邮箱格式不正确!', error);
    return ctx.app.emit('error', FormatWrongErr, ctx);
  }
  await next();
};
