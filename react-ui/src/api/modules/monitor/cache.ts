import { http } from '@/api'
import {
  ICacheMonitoAPI,
  ICacheListAPI,
  IKeysListAPI,
  ICacheContentAPI,
} from '@/type/modules/monitor/cache'

// 查询 缓存监控信息
export const getCacheMonitorAPI = () => {
  return http<ICacheMonitoAPI>('GET', '/monitor/cache')
}

// 查询 缓存列表
export const getCacheListAPI = () => {
  return http<ICacheListAPI>('GET', '/monitor/cacheList')
}

// 查询 缓存键名
export const getCacheKeysAPI = (key: string) => {
  return http<IKeysListAPI>('GET', '/monitor/cacheKeys/' + key)
}

// 查询 缓存内容
export const getCacheContentAPI = (key: string) => {
  return http<ICacheContentAPI>('GET', '/monitor/cacheContent/' + key)
}

//  删除 缓存
export const clearCacheKeyAPI = (key: string) => {
  return http<ICacheContentAPI>('DELETE', '/monitor/clearCacheKey/' + key)
}

//  删除 全部缓存
export const clearCacheKeyAllAPI = () => {
  return http<ICacheContentAPI>('DELETE', '/monitor/clearCache/clean')
}
