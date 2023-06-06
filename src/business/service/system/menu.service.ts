import SysMenu from '@/mysql/model/system/menu.model'
import { MenuParamsType, menusSqlType } from '@/types'
import { Op } from 'sequelize'

// 获取路由
export const getRoutersSer = async () => {
  const firstRes = (await SysMenu.findAll({
    where: {
      status: '0',
      [Op.or]: [{ menu_type: 'M' }, { menu_type: 'C' }]
    }
  })) as unknown as menusSqlType[]

  return firstRes
}

// 获取菜单
export const getMenusSer = async (params: { [key: string]: any }) => {
  const res = await SysMenu.findAll({
    raw: true,
    where: params
  })

  return res
}
