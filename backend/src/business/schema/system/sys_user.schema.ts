import Joi from 'joi';
import { username, email, dictString, phonenumber, nickName, checkNum, password, remark, checkNumArr } from '../config.schema';

// 验证id
export const IdJudge = Joi.object({ userId: Joi.number() });
// 验证 ids
export const IdsJudge = Joi.object({ userId: checkNumArr });

// 验证新增用户信息
export const addUserJudg = Joi.object({
  nickName,
  deptId: checkNum,
  phonenumber,
  email,
  userName: username,
  sex: dictString,
  status: dictString,
  password,
  postIds: checkNumArr,
  roleIds: checkNumArr,
  remark,
});

// 验证修改用户信息
export const putUserJudg = Joi.object({
  nickName,
  deptId: checkNum,
  phonenumber,
  email,
  sex: dictString,
  status: dictString,
  postIds: checkNumArr,
  roleIds: checkNumArr,
  remark,
  userId: Joi.number(),
});

// 验证用户密码
export const checkPwdJudg = Joi.object({ password });
