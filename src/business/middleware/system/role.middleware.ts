import { Context } from 'koa';
import { Op } from 'sequelize';
import { getListSer, addSer, putSer, getDetailSer, delSer, addAllSer, queryConditionsData } from '@/business/service';
import { userType } from '@/types';
import { IroleQueryType, IroleQuerySerType, Irole, IroleSer } from '@/types/system/role';
import errors from '@/app/err.type';
import { formatHumpLineTransfer } from '@/business/utils';
import { excelJsExport } from '@/business/utils/excel';
import { excelBaseStyle } from '@/business/public/excelMap';
import SysRole from '@/mysql/model/system/role.model';
import SysRoleMenu from '@/mysql/model/system/sys_role_menu.model';
import { getRoleMenuIdSer } from '@/business/service/system/role.service';
import { bindCheck } from '@/business/utils/bind';
import SysUserRole from '@/mysql/model/system/sys_user_role.model';
import { updateUserInfo } from '@/business/utils/redis';

const { uploadParamsErr, getListErr, sqlErr, delErr, exportExcelErr } = errors;

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, ...params } = ctx.query as unknown as IroleQueryType;
    const newParams = { pageNum, pageSize, del_flag: '0' } as IroleQuerySerType;
    if (params.createdAt) params.createdAt = JSON.parse(params.createdAt as unknown as string);

    if (params.roleName) newParams.role_name = { [Op.like]: `${params.roleName}%` };
    if (params.roleKey) newParams.role_key = { [Op.like]: `${params.roleKey}%` };
    if (params.status) newParams.status = { [Op.eq]: params.status };
    if (params.createdAt) newParams.created_at = { [Op.between]: [params.createdAt.beginTime, params.createdAt.endTime] };

    const res = await getListSer<IroleQuerySerType>(SysRole, newParams);

    ctx.state.formatData = res;
    await next();
  } catch (error) {
    console.error('查询字典类型列表失败', error);
    return ctx.app.emit('error', getListErr, ctx);
  }
};

// 新增
export const getAddMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType;
    const addContent = ctx.request.body as Irole;
    const addContent2 = { ...addContent, createBy: userName };
    const newAddContent = formatHumpLineTransfer(addContent2, 'line') as IroleSer;

    const res = await addSer<IroleSer>(SysRole, newAddContent);

    // 批量 建立角色与菜单关系
    const RoleMenu = [];
    addContent.menuIds.forEach((menuId) => {
      RoleMenu.push({
        role_id: res.role_id,
        menu_id: menuId,
      });
    });
    await addAllSer(SysRoleMenu, RoleMenu);
    await next();
  } catch (error) {
    console.error('新增用户失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const ids = ctx.state.ids as string[];
    const { userName } = ctx.state.user as userType;

    const res = await bindCheck(SysUserRole, { role_id: ids });

    if (res.length > 0) {
      const relaIds = res.map((item: { user_id: number; role_id: number }) => {
        if (ids.includes(String(item.role_id))) {
          return item.role_id;
        }
        return undefined;
      });
      const roles = await queryConditionsData(SysRole, { role_id: relaIds });
      let roleMessage = '';

      roles.forEach((role) => {
        roleMessage += `${role.role_name},`;
      });
      ctx.body = {
        code: 500,
        message: `${roleMessage}已分配,不能删除`,
      };
    } else {
      await putSer<IroleSer>(SysRole, { role_id: ids }, { del_flag: '1', update_by: userName });
      await next();
    }
  } catch (error) {
    console.error('删除角色失败', error);
    return ctx.app.emit('error', delErr, ctx);
  }
};

// 获取详细数据
export const getDetailMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const res = await getDetailSer<IroleSer>(SysRole, { role_id: ctx.state.ids });

    const roleMenus = await getRoleMenuIdSer(ctx.state.ids);
    const ids = [] as number[];
    roleMenus.forEach((item) => {
      ids.push(item.menu_id);
    });

    ctx.state.formatData = { ...res, menuIds: ids };
  } catch (error) {
    console.error('角色信息查询错误', error);
    return ctx.app.emit('error', sqlErr, ctx);
  }

  await next();
};

// 修改
export const putMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType;
    const res = ctx.request.body as Irole;
    const lineData = formatHumpLineTransfer(res, 'line') as IroleSer;
    const { role_id, ...data } = lineData;

    await putSer<IroleSer>(SysRole, { role_id }, { ...data, update_by: userName });

    // 删除原 角色菜单关系
    const roleMenus = await getRoleMenuIdSer(role_id);
    const ids = [] as number[];
    roleMenus.forEach((item) => {
      ids.push(item.id);
    });
    await delSer(SysRoleMenu, { id: ids });

    // 批量 建立角色与菜单关系
    const RoleMenu = [];
    res.menuIds.forEach((menuId) => {
      RoleMenu.push({
        role_id,
        menu_id: menuId,
      });
    });
    await addAllSer(SysRoleMenu, RoleMenu);
    await next();
    // 查询该角色绑定的用户id
    const userIds = (await queryConditionsData(SysUserRole, { role_id })).map((item) => item.user_id);

    // 更新redis的userInfo
    updateUserInfo('update_userInfo', userIds);
  } catch (error) {
    console.error('修改失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};

// 修改用户状态
export const putRoleStatusMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { userName } = ctx.state.user as userType;
    const { id, status } = ctx.request.body as { status: string; id: number };

    await putSer<IroleSer>(SysRole, { role_id: id }, { status, update_by: userName });

    await next();
  } catch (error) {
    console.error('修改角色状态失败', error);
    return ctx.app.emit('error', uploadParamsErr, ctx);
  }
};

// 导出
export const exportMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.state.formatData;
    const { dicts } = ctx.state;

    // 表格数据
    const buffer = await excelJsExport({
      sheetName: '角色信息表',
      style: excelBaseStyle,
      headerColumns: [
        { title: '角色名称', dataIndex: 'role_name' },
        { title: '角色权限字符串', dataIndex: 'role_key' },
        { title: '显示顺序', dataIndex: 'role_sort' },
        { title: '部门状态（0正常 1停用）', dataIndex: 'status' },
        { title: '创建时间', dataIndex: 'created_at' },
      ],
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
