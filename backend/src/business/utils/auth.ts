import { IuserInfoType } from '@/types/user';
import redis from '@/redis';
import { recordNum } from '@/business/utils/redis';
import { redisType } from '@/config/redis.config';

/**
 * 存储用户 session & userinfo
 * @param key
 * @param data
 * @param time 过期时间设置(min)
 */
export const addSession = async (key: string, data: IuserInfoType, time = 60) => {
  await redis.sadd('login_tokens', key);
  await redis.set(key, JSON.stringify(data));
  recordNum(redisType.set);
  recordNum(redisType.sadd);
  // 对象过期时间设置
  redis.expire(key, time * 60);
  recordNum(redisType.expire);
};

/**
 * 重置存储 session的过期时间
 * @param key
 * @param time 过期时间设置(min)
 */
export const resetTime = (key: string, time = 60) => {
  redis.expire(key, time * 60);
  recordNum(redisType.expire);
};

/**
 * 获取 login_tokens 的 所有的值
 * @returns string[]
 */
export const getAllUserInfo = async () => {
  recordNum(redisType.smembers);
  return (await redis.smembers('login_tokens')) as string[];
};

/**
 * 查询 sessionId 过期了没
 * @param key
 * @returns 1未过期 0过期
 */
export const judgeKeyOverdue = async (key: string) => {
  recordNum(redisType.exists);
  const res = await redis.exists(key);
  return res;
};

/**
 * 批量删除集合内的 sessionId
 * @param keys: string[]
 * @returns
 */
export const removeListKey = async (keys: string[]) => {
  await redis.srem('login_tokens', keys);
  recordNum(redisType.srem);
};

/**
 * 批量删除 redis 的key
 * @param keys string[]
 * @returns
 */
export const removeKey = async (keys: string[]) => {
  await redis.del(...keys);
  recordNum(redisType.del);
};

/**
 * 查询 用户的详细信息
 * @param key
 * @returns
 */
export const queryKeyValue = async (key: string) => {
  recordNum(redisType.get);
  return JSON.parse(await redis.get(key)) as IuserInfoType;
};

/**
 * 批量查询 用户的详细信息
 * @param keys string[]
 * @returns string[]
 */
export const queryAllKeyValue = async (keys: string[]) => {
  const res = await redis.mget(keys);
  recordNum(redisType.mget);
  return res.map((item) => JSON.parse(item)) as IuserInfoType[];
};
