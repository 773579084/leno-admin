import { Context } from 'koa';
import { Op } from 'sequelize';
import { getListSer, delSer, addAllSer } from '@/business/service';
import { IroleUserQueryType, IroleUserQuerySerType, IaddUserRoleType, ISelectUserQueryType } from '@/types/system/roleUser';
import errors from '@/app/err.type';
import LenoUser from '@/mysql/model/user.model';
import SysUserRole from '@/mysql/model/system/sys_user_role.model';
import { roleBindUser } from '@/business/service/system/role.service';

const { uploadParamsErr, getListErr, delErr } = errors;

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as IroleUserQueryType;
    const newParams = { pageNum, pageSize } as IroleUserQuerySerType;

    // 查询 角色绑定的用户id
    const userRoles = await roleBindUser({
      ...newParams,
      role_id: params.roleId,
    });
    const userIds = [];
    userRoles.forEach((item: any) => {
      userIds.push(item.user_id);
    });

    if (params.userName) newParams.user_name = { [Op.like]: `${params.userName}%` };
    if (params.phonenumber) newParams.phonenumber = { [Op.like]: `${params.phonenumber}%` };
    newParams.user_id = { [Op.in]: userIds };

    const res = await getListSer<IroleUserQuerySerType>(LenoUser, newParams);

    ctx.state.formatData = res;
    await next();
  } catch (error) {
    console.error('查询列表失败', error);
    return ctx.app.emit('error', getListErr, ctx);
  }
};

// 新增
export const getAddMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const data = ctx.request.body as IaddUserRoleType;

    const addRoleUser = [];
    data.userId.split(',').forEach((id) => {
      addRoleUser.push({
        role_id: data.roleId,
        user_id: id,
      });
    });

    await addAllSer(SysUserRole, addRoleUser);
    await next();
  } catch (error) {
    console.error('新增失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};

// 取消授权
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const data = ctx.request.body as { roleId: string; userId: string };

    await delSer(SysUserRole, { user_id: data.userId.split(','), role_id: [data.roleId] });
    await next();
  } catch (error) {
    console.error('删除失败', error);
    return ctx.app.emit('error', delErr, ctx);
  }
};

export const unallocatedListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as ISelectUserQueryType;
    const newParams = { pageNum, pageSize } as IroleUserQuerySerType;

    // 查询 角色绑定的用户id
    const userRoles = await roleBindUser({
      ...newParams,
      role_id: params.roleId,
    });
    const userIds = [];
    userRoles.forEach((item: any) => {
      userIds.push(item.user_id);
    });

    if (params.userName) newParams.user_name = { [Op.like]: `${params.userName}%` };
    if (params.phonenumber) newParams.phonenumber = { [Op.like]: `${params.phonenumber}%` };
    newParams.del_flag = '0';
    newParams.user_id = { [Op.notIn]: userIds };

    const res = await getListSer<IroleUserQuerySerType>(LenoUser, newParams);
    ctx.state.formatData = res;
    await next();
  } catch (error) {
    console.error('查询列表失败', error);
    return ctx.app.emit('error', getListErr, ctx);
  }
};
