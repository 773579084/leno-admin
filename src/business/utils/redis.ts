import { redisType } from '@/config/redis.config'
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
  recordNum(redisType.set)
}

/**
 * 查询菜单信息
 */
export const queryMenuMes = async () => {
  recordNum(redisType.get)
  return JSON.parse(await redis.get('menu_message')) as menusType[]
}

/**
 * 记录redis命令使用次数
 * @param type: string
 */
export const recordNum = async (type: string) => {
  redis.incr(type)
}

/**
 * 查redis命令使用次数
 * @param types: string[]
 */
export const getRecordNum = async (types: string[]) => {
  recordNum(redisType.mget)
  return await redis.mget(types)
}

/**
 * 查询所有 集合 key
 * @return
 */
export const querySetKeys = async () => {
  const allKeys = await redis.keys('*')
  recordNum(redisType.keys)
  const list = []
  for (let i = 0; i < allKeys.length; i++) {
    const type = await redis.type(allKeys[i])
    recordNum(redisType.type)
    if (type === 'set') {
      list.push(allKeys[i])
    }
  }

  return list
}

/**
 * 获取 集合 的 所有的值
 * @param key string
 * @returns string[]
 */
export const getSetsValue = async (key: string) => {
  recordNum(redisType.smembers)
  return (await redis.smembers(key)) as string[]
}

/**
 * 批量删除集合内的值
 * @param setName: string
 * @param keys: string[]
 * @returns
 */
export const removeSetKeys = async (setName: string, keys: string[]) => {
  await redis.srem(setName, keys)
  recordNum(redisType.srem)
}

/**
 * 删除集合
 * @param setName: string
 * @param keys string
 */
export const removeSet = async (setName: string, keys: string[]) => {
  await redis.srem(setName, keys)
  recordNum(redisType.srem)
}
