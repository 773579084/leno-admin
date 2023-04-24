import Menu from '@/mysql/model/system/menu.model'
import { MenuParamsType, menusSqlType } from '@/types'
import { Op } from 'sequelize'

// 获取路由
export const getRoutersSer = async () => {
  const firstRes = (await Menu.findAll({
    where: {
      status: '0',
      [Op.or]: [{ menu_type: 'M' }, { menu_type: 'C' }]
    }
  })) as unknown as menusSqlType[]

  return firstRes
}

// 获取菜单
export const getMenusSer = async (params: MenuParamsType) => {
  const whereObj = {}
  const { status, menuName } = params
  status && Object.assign(whereObj, { status })
  menuName && Object.assign(whereObj, { menu_name: menuName })

  const res = await Menu.findAll({
    raw: true,
    where: whereObj
  })

  return res
}
