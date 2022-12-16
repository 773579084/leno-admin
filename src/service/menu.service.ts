import Menu from '../model/menu.model'
import { menusType } from '../types'
import { Op } from 'sequelize'

class MenuService {
  /**
   * 一级菜单 1开头
   * 二级菜单 100开头
   * 三级菜单 500开头
   * 按钮权限 1000开头
   */
  // 获取菜单
  async getRoutersSer(menu_id) {
    // 先查询 parent_id = 0 的所有的一级菜单
    const firstRes = Menu.findAll({
      where: {
        parent_id: menu_id,
        [Op.or]: [{ menu_type: 'M' }, { menu_type: 'C' }]
      }
    }) as unknown as menusType[]

    return firstRes
  }
}

export const { getRoutersSer } = new MenuService()
