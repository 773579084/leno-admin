import { redisType } from '@/config/redis.config';
import redis from '@/redis';
import { RouteType } from '@/types/system/system_menu';
import { formatHumpLineTransfer } from '.';

export interface menuQueryType {
  pageNum: number;
  pageSize: number;
  menu_type: string;
}

/**
 * 记录redis命令使用次数
 * @param type: string
 */
export const recordNum = async (type: string) => {
  redis.incr(type);
};

/**
 * 存储所有菜单的信息（供全局调用）
 * @param menus
 */
export const saveMenuMes = async (menus: RouteType[]) => {
  const res = formatHumpLineTransfer(menus);
  redis.set('menu_message', JSON.stringify(res));
  recordNum(redisType.set);
};

/**
 * 查询菜单信息
 */
export const queryMenuMes = async () => {
  recordNum(redisType.get);
  return JSON.parse(await redis.get('menu_message')) as RouteType[];
};

/**
 * 查redis命令使用次数
 * @param types: string[]
 */
export const getRecordNum = async (types: string[]) => {
  recordNum(redisType.mget);
  const res = await redis.mget(types);
  return res;
};

/**
 * 查询所有 集合 key
 * @return
 */
export const querySetKeys = async () => {
  const allKeys = await redis.keys('*');
  recordNum(redisType.keys);
  const list = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < allKeys.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    const type = await redis.type(allKeys[i]);
    recordNum(redisType.type);
    if (type === 'set') {
      list.push(allKeys[i]);
    }
  }

  return list;
};

/**
 * 存储 集合 值
 * @param key
 * @param ids
 */
export const updateUserInfo = async (key: string, ids: number[]) => {
  await redis.sadd(key, ids);
};

/**
 * 获取 集合 的 所有的值
 * @param key string
 * @returns string[]
 */
export const getSetsValue = async (key: string) => {
  recordNum(redisType.smembers);
  return (await redis.smembers(key)) as string[];
};

/**
 * 批量删除集合内的值
 * @param setName: string
 * @param keys: string[]
 * @returns
 */
export const removeSetKeys = async (setName: string, keys: string[]) => {
  await redis.srem(setName, keys);
  recordNum(redisType.srem);
};

/**
 * 删除集合
 * @param setName: string
 * @param keys string
 */
export const removeSet = async (setName: string, keys: string[]) => {
  await redis.srem(setName, keys);
  recordNum(redisType.srem);
};

/**
 * 存储 key value 键值对
 * @param key
 * @param value
 * @param time 过期时间设置(min)
 */
export const saveKey = async (key: string, value: any, time = 60) => {
  await redis.set(key, value);
  recordNum(redisType.set);
  // 对象过期时间设置
  redis.expire(key, time * 60);
  recordNum(redisType.expire);
};
