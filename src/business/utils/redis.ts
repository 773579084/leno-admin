import SysMenu from '@/mysql/model/system/menu.model'
import redis from '@/redis'
import { menusType } from '@/types/system/system_menu'
import { formatHumpLineTransfer } from '.'
import { getListSer } from '../service'

export interface menuQueryType {
  pageNum: number
  pageSize: number
  menu_type: string
}

/**
 * 存储所有菜单的信息（供全局调用）
 */
export const saveMenuMes = async () => {
  const { rows } = await getListSer<menuQueryType>(SysMenu, {
    pageNum: 1,
    pageSize: 1000,
    menu_type: 'C'
  })

  const res = formatHumpLineTransfer(rows)
  redis.set('menu_message', JSON.stringify(res))
}

/**
 * 查询菜单信息
 */
export const queryMenuMes = async () => {
  return JSON.parse(await redis.get('menu_message')) as menusType[]
}
