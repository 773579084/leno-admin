import Menu from '@/model/system/menu.model'
import { menusSqlType } from '@/types'
import { date } from 'joi'
import { Op } from 'sequelize'

class MenuService {
  // 获取路由
  async getRoutersSer() {
    const firstRes = (await Menu.findAll({
      where: {
        status: '0',
        [Op.or]: [{ menu_type: 'M' }, { menu_type: 'C' }]
      }
    })) as unknown as menusSqlType[]

    return firstRes
  }
  // 获取菜单
  async getMenusSer({ status, menuName }) {
    console.log(19, status, menuName)

    const whereObj = {}
    status && Object.assign(whereObj, { status })
    menuName && Object.assign(whereObj, { menu_name: menuName })

    const res = await Menu.findAll({
      raw: true,
      where: whereObj
    })
    console.log(28, res)

    return res
  }

  // 新增
  async addSer(list) {
    const res = await Menu.create(list)
    return res || {}
  }

  // 删除
  async delSer(ids) {
    const res = await Menu.destroy({ where: { menu_id: ids } })

    return res || null
  }

  // 获取 详细信息
  async getDetailSer({ menu_id }) {
    const res = (await Menu.findOne({
      raw: true,
      where: { menu_id }
    })) as any
    return res
  }

  async putSer(list: menusSqlType) {
    const { menu_id, ...date } = list
    const res = await Menu.update(date, { where: { menu_id } })

    return res[0] > 0
  }
}

export const { getRoutersSer, getMenusSer, addSer, delSer, getDetailSer, putSer } =
  new MenuService()
