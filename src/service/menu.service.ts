import Menu from '../model/menu.model'
import { menusType } from '../types'

class MenuService {
  // 获取路由
  async getRoutersSer() {
    /**
     * 一级菜单 1开头
     * 二级菜单 100开头
     * 三级菜单 500开头
     * 按钮权限 1000开头
     */
    const routes = []
    // 先查询 parent_id = 0 的所有的一级菜单
    const firstRes = Menu.findAll({
      where: {
        parent_id: 0
      }
    }) as unknown as menusType[]
    // 按照路由格式存储一级菜单
    firstRes.forEach((item) => {
      routes.push({})
    })

    // 遍历一级菜单，然后分别查找二级菜单

    // return res
  }
}

export const { getRoutersSer } = new MenuService()
