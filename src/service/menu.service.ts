import Menu from '../model/menu.model'
import { menusType } from '../types'

class MenuService {
  // 获取路由
  async getRoutersSer() {
    const res = (await Menu.findAll()) as unknown as menusType[]

    return res
  }
}

export const { getRoutersSer } = new MenuService()
