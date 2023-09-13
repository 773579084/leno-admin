import SysDept from '@/mysql/model/system/dept.model';
import LenoUser from '@/mysql/model/user.model';
import { userType } from '@/types';

// 注册
export const createdUser = async (userName: string, password: string) => {
  // 插入数据到数据库
  const res = (await LenoUser.create({ user_name: userName, password })) as any;

  return res.dataValues;
};

// 查询改名用户的账号状态
export const userStatusSer = async (userName: string) => {
  // 插入数据到数据库
  const res = await LenoUser.findOne({
    raw: true,
    attributes: ['status'],
    where: { user_name: userName },
  });
  return res;
};

// 查找数据是否有重复的数据
export const getUserInfo = async ({ userId, userName, password }: userType) => {
  const whereOpt = {};

  // 判断传了那个数，就将那个数传入到 whereOpt中
  if (userId) Object.assign(whereOpt, { user_id: userId });
  if (userName) Object.assign(whereOpt, { user_name: userName });
  if (password) Object.assign(whereOpt, { password });

  // 查找是否重复
  const res = (await LenoUser.findOne({
    attributes: ['user_id', 'user_name', 'password'],
    where: whereOpt,
  })) as any;

  return res ? res.dataValues : null;
};

// 获取 详细信息
export const getAllUserInfoSer = async ({ userId }) => {
  const res = (await LenoUser.findOne({
    where: { user_id: userId },
    include: [
      {
        model: SysDept,
        as: 'dept',
      },
    ],
  })) as any;
  return res ? res.dataValues : null;
};

// 更新密码数据
export const updatePassword = async ({ newPwd, userId, update_by }: { newPwd: string; userId: number; update_by: string }) => {
  const res = await LenoUser.update({ password: newPwd, update_by }, { where: { user_id: userId } });

  return res[0] > 0;
};

// 更新个人信息
export const updateUserInfoSer = async ({ userId, email, nickName, phonenumber, sex, update_by }) => {
  const res = await LenoUser.update(
    {
      email,
      nick_name: nickName,
      phonenumber,
      sex,
      update_by,
    },
    { where: { user_id: userId } },
  );

  return res[0] > 0;
};

// 查找用户之前有无上传头像，有上传将之前上传的删除掉
export const deletFrontAvatarSer = async ({ userId }) => {
  const res = (await LenoUser.findOne({
    attributes: ['avatar'],
    where: { user_id: userId },
  })) as any;

  return res ? res.dataValues : '';
};

// 上传个人头像地址
export const updateAvatarSer = async ({ userId, basePath, update_by }) => {
  const res = await LenoUser.update({ avatar: basePath, update_by }, { where: { user_id: userId } });

  return res || '';
};
