import SysRoleMenu from '@/mysql/model/system/sys_role_menu.model'
import { IroleMenuType } from '@/types/system/role'

// 获取所有的角色 与 菜单关系的id
export const getRoleMenuIdSer = async (role_id: number) => {
  const res = (await SysRoleMenu.findAll({
    raw: true,
    where: {
      role_id
    }
  })) as unknown as IroleMenuType[]

  return res
}
