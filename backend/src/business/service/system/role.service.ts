import SysRoleMenu from '@/mysql/model/system/sys_role_menu.model';
import SysUserRole from '@/mysql/model/system/sys_user_role.model';
import { IroleMenuType } from '@/types/system/role';
import { IRoleBindUserType } from '@/types/system/roleUser';

// 获取所有的角色 与 菜单关系的id
export const getRoleMenuIdSer = async (role_id: number) => {
  const res = (await SysRoleMenu.findAll({
    raw: true,
    where: { role_id },
  })) as unknown as IroleMenuType[];

  return res;
};

// 获取角色 绑定的用户
export const roleBindUser = async (queryParams: IRoleBindUserType) => {
  const obj = {};
  const { pageNum = 1, pageSize = 10, ...params } = queryParams;

  if (queryParams.pageNum)
    Object.assign(obj, {
      offset: (Number(pageNum) - 1) * Number(pageSize),
      limit: Number(pageSize),
    });

  const res = await SysUserRole.findAll({
    raw: true,
    ...obj,
    where: { ...params },
  });

  return res;
};
