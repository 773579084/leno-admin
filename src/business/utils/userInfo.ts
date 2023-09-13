import { Op } from 'sequelize';
import SysMenu from '@/mysql/model/system/menu.model';
import SysRole from '@/mysql/model/system/role.model';
import SysRoleMenu from '@/mysql/model/system/sys_role_menu.model';
import { IuserInfoType, userType } from '@/types';
import { formatHumpLineTransfer } from '.';
import { queryConditionsData } from '../service';
import { getUserRoleSer } from '../service/system/user.service';
import { getAllUserInfoSer } from '../service/user.service';

/**
 * 获取用户所有信息
 * @param userId
 * @returns
 */
export const getUserInfoAll = async (userId: number) => {
  const { password, ...res } = await getAllUserInfoSer({ userId });
  // 查询用户关联角色id
  const roleIds = (await getUserRoleSer(userId)) as unknown as { role_id: number }[];
  const ids = roleIds.map((item) => item.role_id);

  const roleMessage = await queryConditionsData(SysRole, { role_id: { [Op.in]: ids } });
  res.roles = roleMessage;
  const userInfo = formatHumpLineTransfer(res) as userType;

  const roles = [];
  const permissionsIds = [];
  const permissions = [];

  userInfo.roles.forEach((item) => {
    if (item.roleKey === 'admin') {
      permissions.push('*:*:*');
      roles.push('admin');
    } else {
      roles.push(item.roleKey);
      permissionsIds.push(item.roleId);
    }
  });

  // 返回权限 如果 permissions 有值，则表示为超级管理员，否则
  if (permissions.length < 1) {
    // 查询角色关联的菜单ids
    const menuRole = (await queryConditionsData(SysRoleMenu, { role_id: { [Op.in]: permissionsIds } }, { attributes: ['menu_id'] })) as { menu_id: number }[];
    const menuIds = menuRole.map((item) => item.menu_id);

    // 查寻找角色相关的菜单
    const menus = (await queryConditionsData(SysMenu, { menu_id: { [Op.in]: Array.from(new Set(menuIds)) } })) as { perms: string }[];

    menus.forEach((menu) => {
      if (menu.perms) permissions.push(menu.perms);
    });
  }

  return {
    userInfo,
    roles,
    permissions,
  } as IuserInfoType;
};
