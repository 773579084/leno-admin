import { IuserInfoType } from '@/types/user'
import redis from '@/redis'

/**
 * 存储用户 session & userinfo
 * @param key sessionId
 * @param data userInfo
 * @param time 过期时间设置(min)
 */
export const addSession = async (key: string, data: IuserInfoType, time = 10) => {
  await redis.sadd('login_tokens', key)
  await redis.set(key, JSON.stringify(data))

  // 对象过期时间设置
  redis.expire(key, time * 60)
}

/**
 * 重置存储 session的过期时间
 * @param key
 * @param time 过期时间设置(min)
 */
export const resetTime = (key: string, time = 10) => {
  redis.expire(key, time * 60)
}

/**
 * 获取 login_tokens 的 所有的值
 * @returns string[]
 */
export const getAllUserInfo = async () => {
  const res = await redis.smembers('login_tokens')
  console.log(31, res)
  return res
}
