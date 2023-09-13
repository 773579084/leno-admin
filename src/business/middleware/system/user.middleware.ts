import { Context } from 'koa';
import { Op } from 'sequelize';
import {
  getUserListSer,
  getdeptTreeSer,
  getPostSer,
  getRoleSer,
  addUserRoleSer,
  addUserPostSer,
  addUserSer,
  getUserPostSer,
  getUserRoleSer,
  putUserSer,
  delUserRole,
  delUserPost,
  putUserStatusSer,
  exportUserListSer,
  delUserSer,
} from '@/business/service/system/user.service';
import { userListType, userType, IUserDetail, userQueryType, userQuerySerType } from '@/types';
import { IdJudge, checkPwdJudg } from '@/business/schema/system/sys_user.schema';
import { updatePassword, getAllUserInfoSer } from '@/business/service/user.service';
import errors from '@/app/err.type';
import { formatHumpLineTransfer, pwdHash } from '@/business/utils';
import { excelJsExport } from '@/business/utils/excel';
import { excelBaseStyle, userExcelHeader, userTemExcelHeader } from '@/business/public/excelMap';
import SysDept from '@/mysql/model/system/dept.model';
import { IroleSer } from '@/types/system/role';
import { IpostSer } from '@/types/system/post';
import { IdeptSer } from '@/types/system/dept';
import { delSer } from '@/business/service';
import SysUserRole from '@/mysql/model/system/sys_user_role.model';
import SysUserPost from '@/mysql/model/system/sys_user_post.model';
import { updateUserInfo } from '@/business/utils/redis';

const { checkUserIdErr, getDeptTreeErr, addUserErr, getPostRoleErr, checkPwdErr, sqlErr, putUserErr, exportUserListErr, delErr, exportExcelErr, importErr } = errors;

// 生成用户列表
export const getUserListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as userQueryType;
    const newParams = { pageNum, pageSize } as userQuerySerType;
    if (params.deptId) {
      try {
        const depts = (await getdeptTreeSer()) as any;
        const deptIds = [];
        depts.forEach((item: { dataValues: { ancestors: string | string[] }; dept_id: number }) => {
          if (item.dataValues.ancestors.indexOf(`${params.deptId}`) !== -1) {
            deptIds.push(item.dept_id);
          }
        });
        newParams.dept_id = [params.deptId, ...deptIds];
      } catch (error) {
        console.error('查询部门失败!', ctx.request.body);
      }
    }
    if (params.beginTime) {
      newParams.beginTime = params.beginTime;
      newParams.endTime = params.endTime;
    }

    if (params.userName) newParams.user_name = { [Op.like]: `${params.userName}%` };
    if (params.phonenumber) newParams.phonenumber = { [Op.like]: `${params.phonenumber}%` };
    if (params.status) newParams.status = params.status;

    const res = (await getUserListSer(newParams)) as userListType;

    ctx.state.formatData = res;
    await next();
  } catch (error) {
    console.error('查询部门角色失败', error);
    return ctx.app.emit('error', getPostRoleErr, ctx);
  }
};

// 导出用户列表
export const exportUserListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await exportUserListSer();
    ctx.state.formatData = res;
  } catch (error) {
    console.error('导出用户列表错误!', ctx.request.body);
    return ctx.app.emit('error', exportUserListErr, ctx);
  }
  await next();
};

// 查询部门下拉树结构
export const deptTreeMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = (await getdeptTreeSer()) as unknown as IdeptSer[];

    // 将部门进行树状结构数据
    const deptTree = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < res.length; i++) {
      if (res[i].parent_id === 0) {
        const newObj = {
          key: res[i].dept_id,
          title: res[i].dept_name,
        };
        // 此步骤减少递归次数，增加性能
        res.splice(i, 1);
        // eslint-disable-next-line no-plusplus
        i ? (i = 0) : i--;
        // 递归查找子集结构
        const checkChild = (obj, parent_id) => {
          // 判断 子 父 结构的 parent_id 是否相等
          // eslint-disable-next-line no-plusplus
          for (let j = 0; j < res.length; j++) {
            if (res[j].parent_id === parent_id) {
              const newObj2 = {
                key: res[j].dept_id,
                title: res[j].dept_name,
              };
              // eslint-disable-next-line no-param-reassign
              if (!(obj.children instanceof Array)) obj.children = [];
              obj.children.push(newObj2);
              res.splice(j, 1);
              // eslint-disable-next-line no-plusplus
              j ? (j = 0) : j--;
              checkChild(newObj2, newObj2.key);
            }
          }
        };
        checkChild(newObj, newObj.key);
        deptTree.push(newObj);
      }
    }

    ctx.state.formatData = deptTree;
  } catch (error) {
    console.error('查询部门失败!', ctx.request.body);
    return ctx.app.emit('error', getDeptTreeErr, ctx);
  }
  await next();
};

// 岗位及角色数据获取
export const getPostRoleMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const postRes = await getPostSer();
    const roleRes = await getRoleSer();
    ctx.state.formatData = {
      posts: postRes,
      roles: roleRes,
    };
    await next();
  } catch (error) {
    console.error('获取部门和角色信息失败', error);
    return ctx.app.emit('error', addUserErr, ctx);
  }
};

// 新增用户
export const getAddUserMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType;
    const { postIds, roleIds, ...user } = ctx.request.body as userType;
    const user2 = { ...user, createBy: userName };
    const newUser = formatHumpLineTransfer(user2, 'line');
    const { user_id } = await addUserSer(newUser);
    // //绑定角色岗位关系
    if (roleIds?.length > 0) {
      const createRole = [];

      roleIds?.forEach((item) => {
        createRole.push({
          user_id,
          role_id: item,
        });
      });
      await addUserRoleSer(createRole);
    }
    if (postIds?.length > 0) {
      const createPost = [];
      postIds?.forEach((item) => {
        createPost.push({
          user_id,
          post_id: item,
        });
      });
      await addUserPostSer(createPost);
    }
    await next();
  } catch (error) {
    console.error('新增用户失败', error);
    return ctx.app.emit('error', addUserErr, ctx);
  }
};

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    // 删除用户时，将用户关联的角色和部门关系删除
    await delSer(SysUserRole, { user_id: ctx.state.ids });
    await delSer(SysUserPost, { user_id: ctx.state.ids });
    await delUserSer(ctx.state.ids);
  } catch (error) {
    console.error('删除用户失败', error);
    return ctx.app.emit('error', delErr, ctx);
  }

  await next();
};

// 修改密码
export const updatePwdMid = async (ctx: Context, next: () => Promise<void>) => {
  const { password, userId } = ctx.request.body;
  const { userName } = ctx.state.user as userType;
  try {
    await checkPwdJudg.validateAsync({ password });
  } catch (error) {
    console.error('密码参数错误', error);
    return ctx.app.emit('error', checkPwdErr, ctx);
  }

  try {
    await updatePassword({ newPwd: pwdHash(password), userId, update_by: userName });
  } catch (error) {
    console.error('服务器错误', error);
    return ctx.app.emit('error', sqlErr, ctx);
  }

  await next();
};

// 获取用户个人详细数据
export const userInfoMid = async (ctx: Context, next: () => Promise<void>) => {
  const { path } = ctx.request;
  const userId = path.split('/')[path.split('/').length - 1];
  let finRes = {} as IUserDetail;

  try {
    await IdJudge.validateAsync({ userId });
  } catch (error) {
    console.error('用户上传id错误', error);
    return ctx.app.emit('error', checkUserIdErr, ctx);
  }

  try {
    const { password, ...res } = await getAllUserInfoSer({ userId });
    finRes = { ...res };
  } catch (error) {
    console.error('用户个人信息查询错误', error);
    return ctx.app.emit('error', sqlErr, ctx);
  }

  try {
    const postIds = [];
    const roleIds = [];
    // 岗位
    const res = (await getUserPostSer(userId)) as unknown as { post_id: number }[];
    res.forEach((item) => postIds.push(item.post_id));
    finRes.postIds = postIds;
    const res2 = (await getPostSer()) as IpostSer[];
    finRes.posts = res2;
    // 角色
    const roleRes = (await getUserRoleSer(userId)) as unknown as { role_id: number }[];
    roleRes.forEach((item) => {
      roleIds.push(item.role_id);
    });
    finRes.roleIds = roleIds as number[];
    const roleRes2 = (await getRoleSer()) as IroleSer[];

    finRes.roles = roleRes2.filter((item) => item.role_key !== 'admin');
    ctx.state.formatData = finRes;
    await next();
  } catch (error) {
    console.error('查询用户岗位与角色信息错误', error);
    return ctx.app.emit('error', sqlErr, ctx);
  }
};

// 修改用户
export const putUserMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType;
    const { postIds, roleIds, ...user } = ctx.request.body as userType;
    await putUserSer({ ...user, update_by: userName });
    // 重新绑定 用户与岗位&角色关系
    if (roleIds?.length > 0) {
      await delUserRole(user.userId);
      const createRole = [];
      roleIds?.forEach((item) => {
        createRole.push({
          user_id: user.userId,
          role_id: item,
        });
      });
      await addUserRoleSer(createRole);
    }
    if (postIds?.length > 0) {
      await delUserPost(user.userId);
      const createPost = [];
      postIds?.forEach((item) => {
        createPost.push({
          user_id: user.userId,
          post_id: item,
        });
      });
      await addUserPostSer(createPost);
    }
    await next();
    // 更新redis的userInfo
    updateUserInfo('update_userInfo', [user.userId]);
  } catch (error) {
    console.error('修改用户失败', error);
    return ctx.app.emit('error', putUserErr, ctx);
  }
};

// 修改用户状态
export const putUserStatusMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType;
    const { userId, status } = ctx.request.body as userType;
    ctx.state.status = status;
    await putUserStatusSer({ userId, status, update_by: userName });

    await next();
  } catch (error) {
    console.error('修改用户状态失败', error);
    return ctx.app.emit('error', putUserErr, ctx);
  }
};

// 导出
export const exportMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.state.formatData;
    const { dicts } = ctx.state;

    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '用户数据',
      style: excelBaseStyle,
      headerColumns: userExcelHeader,
      tableData: list,
      dicts,
    });

    ctx.state.buffer = buffer;
    await next();
  } catch (error) {
    console.error('导出失败', error);
    return ctx.app.emit('error', exportExcelErr, ctx);
  }
};

// 导出模板
export const exportTemMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '用户数据',
      style: excelBaseStyle,
      headerColumns: userTemExcelHeader,
      tableData: [],
    });

    ctx.state.buffer = buffer;
    await next();
  } catch (error) {
    console.error('导出失败', error);
    return ctx.app.emit('error', exportExcelErr, ctx);
  }
};

// 导入 用户excel
export const importExcelUserCon = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { excelData } = ctx.state;
    // 将导入用户的部门名称替换成部门id
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < excelData.length; i++) {
      for (const key in excelData[i]) {
        if (key === 'dept.dept_name') {
          // eslint-disable-next-line no-await-in-loop
          const deptArr = (await SysDept.findAll({
            raw: true,
            attributes: ['dept_id'],
            where: { dept_name: excelData[i][key] },
          })) as unknown as { dept_id: number }[];
          excelData[i].dept_id = deptArr[0].dept_id;
          excelData[i].email = excelData[i].email.text;
        }
      }
    }
    ctx.state.excelData = excelData;
    await next();
  } catch (error) {
    console.error('导入失败', error);
    return ctx.app.emit('error', importErr, ctx);
  }
};
