import Router from 'koa-router';
import {
  loginValidatorMid,
  verifyUserMid,
  crptyPasswordMid,
  isUserStatusMid,
  registerMid,
  loginMid,
  updatePwdMid,
  updateUserInfoMid,
  uploadAvatarMid,
  getUserBaseMid,
  getProfile,
  userLogoutMid,
  queryUserInfoMid,
  captchaImageMid,
  iscaptchaImageMid,
} from '@/business/middleware/user.middleware';
import IndexCon from '@/business/controller';
import { userSchema, pwdSchema, userInfoSchema } from '@/business/schema/user.schema';
import { contrastFileSizeSchema, judImgFormatSchema } from '@/business/schema';
import { hasPermi } from '@/business/middleware/common/auth';
import { conversionMid, getRouterMid } from '../middleware/system/menu.middleware';

const router = new Router({ prefix: '/user' });
// 登录
router.post('/login', userSchema, iscaptchaImageMid, isUserStatusMid, loginValidatorMid, getUserBaseMid, loginMid, IndexCon('用户登录成功'));

// 注册
router.post('/register', userSchema, iscaptchaImageMid, verifyUserMid, crptyPasswordMid, registerMid, IndexCon('注册成功'));

// 验证码
router.get('/captchaImage', captchaImageMid, IndexCon());

// 退出账号
router.delete('/logout', userLogoutMid, IndexCon('退出账号成功'));

// 获取用户及权限角色信息
router.get('/getInfo', queryUserInfoMid, IndexCon('获取用户个人信息成功'));

// 查询routers菜单
router.get('/menu/getRouters', conversionMid, getRouterMid, IndexCon());

// 获取用户所有的个人信息
router.get('/profile', hasPermi('profile:list'), queryUserInfoMid, getProfile, IndexCon('获取用户个人信息成功'));

// 修改用户密码
router.put('/profile/updatePwd', hasPermi('profile:list'), pwdSchema, updatePwdMid, IndexCon('密码修改成功'));

// 修改用户个人信息
router.put('/profile', hasPermi('profile:list'), userInfoSchema, updateUserInfoMid, IndexCon());

// 用户头像上传
router.post('/profile/avatar', hasPermi('profile:list'), contrastFileSizeSchema(), judImgFormatSchema(), uploadAvatarMid, IndexCon('用户上传头像成功'));

export default router;
