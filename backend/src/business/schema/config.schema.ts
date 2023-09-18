// 通用验证方法设置
import Joi from 'joi';

// 用户名称
export const username = Joi.string().min(4).max(11).required();
// 密码判断
export const password = Joi.string().min(4).max(11).required();

// 手机号验证
export const phonenumber = Joi.string()
  .pattern(/^1[3-9]\d{9}$/)
  .allow('')
  .allow(null);

// 用户昵称
export const nickName = Joi.string().min(1).max(10).required();

// 邮箱
export const email = Joi.string().email().allow('').allow(null);

// 检测 number
export const checkNum = Joi.number().allow('').allow(null);

// 备注
export const remark = Joi.string().max(255).allow('').allow(null);

// 检查 num数组
export const checkNumArr = Joi.array().items(Joi.number());

// 必传id
export const mustId = Joi.number().required();

// 任何都可以
export const anySche = Joi.any();

// 验证id
export const IdJudge = Joi.object({ id: Joi.number() });

// 验证 ids
export const IdsJudge = Joi.object({ ids: checkNumArr });

// 验证字典规定状态类
export const dictString = Joi.string().max(50).allow('').allow(null);

// 验证必传字符串
export const requireString = Joi.string().max(500).required();

// 要求数组不为空
export const arrayNoNull = Joi.array().min(1).required();
