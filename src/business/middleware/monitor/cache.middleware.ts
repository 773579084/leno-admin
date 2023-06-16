import { Context } from 'koa'
// import { IserverType } from '@/types/monitor/cache'
import errors from '@/app/err.type'
const { getListErr } = errors
import redis from '@/redis'
import { parse } from 'redis-info'
import { recordNum, getRecordNum, querySetKeys } from '@/business/utils/redis'
import { redisType } from '@/config/redis.config'

// 查询 缓存监控信息
export const getCacheMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const redisInfo = await redis.info()
    recordNum(redisType.info)
    const redisObj = parse(redisInfo)

    // redis 基本信息
    const info = {
      version: redisObj.redis_version,
      day: redisObj.uptime_in_days,
      aof: redisObj.aof_enabled,
      type: redisObj.redis_mode,
      memoryShow: redisObj.used_memory_human,
      memory: redisObj.used_memory,
      rdb: redisObj.rdb_last_bgsave_status,
      port: redisObj.tcp_port,
      cpu: redisObj.used_cpu_user_children,
      keys: redisObj.databases[0],
      client: redisObj.connected_clients,
      memoryTotal: redisObj.used_memory_peak_human,
      ipEnter: redisObj.instantaneous_input_kbps,
      ipOut: redisObj.instantaneous_output_kbps
    }

    // 查询 redis 命令行使用次数
    const types = Object.keys(redisType)
    const commandStats = await getRecordNum(types)
    const res = commandStats.map((item, index) => {
      return {
        name: types[index],
        value: item
      }
    })

    ctx.state.formatData = {
      info,
      commandStats: res.filter((item) => item.value)
    }
    await next()
  } catch (error) {
    console.error('缓存监控信息', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}

// 查询 缓存列表
export const getCacheListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const setKeys = await querySetKeys()
    console.log(60, setKeys)

    ctx.state.formatData = {}
    await next()
  } catch (error) {
    console.error('缓存列表', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}

// 查询 缓存键名
export const getCacheKeysMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    ctx.state.formatData = {}
    await next()
  } catch (error) {
    console.error('缓存列表', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}

// 查询 缓存内容
export const getCacheContentMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    ctx.state.formatData = {}
    await next()
  } catch (error) {
    console.error('缓存列表', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}
