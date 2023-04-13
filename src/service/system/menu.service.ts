import Menu from '@/model/system/menu.model'
import { menusSqlType } from '@/types'
import { Op } from 'sequelize'

class MenuService {
  /**
   * 一级菜单 1开头
   * 二级菜单 100开头
   * 三级菜单 500开头
   * 按钮权限 1000开头
   */
  // 获取菜单
  async getRoutersSer() {
    const firstRes = (await Menu.findAll({
      where: {
        status: '0',
        [Op.or]: [{ menu_type: 'M' }, { menu_type: 'C' }]
      }
    })) as unknown as menusSqlType[]

    return firstRes
  }
}

export const { getRoutersSer } = new MenuService()
