import { Context } from 'koa';
import { Op } from 'sequelize';
import { addAllSer, delSer, getListSer } from '@/business/service';
import errors from '@/app/err.type';

import SysUserRole from '@/mysql/model/system/sys_user_role.model';
import { IroleQuerySerType, IroleQueryType } from '@/types/system/role';
import SysRole from '@/mysql/model/system/role.model';

const { uploadParamsErr, getListErr } = errors;

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize } = ctx.query as unknown as IroleQueryType;

    const res = await getListSer<IroleQuerySerType>(SysRole, {
      pageNum,
      pageSize,
      del_flag: '0',
      role_key: { [Op.ne]: 'admin' },
    });

    ctx.state.formatData = res;
    await next();
  } catch (error) {
    console.error('查询字典类型列表失败', error);
    return ctx.app.emit('error', getListErr, ctx);
  }
};

// 设置 用户 角色信息
export const getAddMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const data = ctx.request.body as {
      userId: string;
      roleIds: number[];
    };

    // 删除之前的 用户角色关系
    await delSer(SysUserRole, { user_id: data.userId });

    // 建立新的 用户角色关系
    const addRoleUser = data.roleIds.map((id) => ({
      user_id: data.userId,
      role_id: id,
    }));

    await addAllSer(SysUserRole, addRoleUser);
    await next();
  } catch (error) {
    console.error('新增失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};
