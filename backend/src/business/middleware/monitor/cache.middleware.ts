import { Context } from 'koa';
import { parse } from 'redis-info';
import errors from '@/app/err.type';
import redis from '@/redis';
import { recordNum, getRecordNum, querySetKeys, getSetsValue, removeSetKeys, removeSet } from '@/business/utils/redis';
import { redisListType, redisType } from '@/config/redis.config';
import { queryKeyValue, removeKey } from '@/business/utils/auth';

const { getListErr, delErr } = errors;

// 查询 缓存监控信息
export const getCacheMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const redisInfo = await redis.info();
    recordNum(redisType.info);
    const redisObj = parse(redisInfo);

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
      ipOut: redisObj.instantaneous_output_kbps,
    };

    // 查询 redis 命令行使用次数
    const types = Object.keys(redisType);
    const commandStats = await getRecordNum(types);
    const res = commandStats.map((item, index) => ({
      name: types[index],
      value: item,
    }));

    ctx.state.formatData = {
      info,
      commandStats: res.filter((item) => item.value),
    };
    await next();
  } catch (error) {
    console.error('缓存监控信息', error);
    return ctx.app.emit('error', getListErr, ctx);
  }
};

// 查询 缓存列表
export const getCacheListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const setKeys = (await querySetKeys()).filter((item) => item !== 'tool_sql_names');

    const newKeys = setKeys.map((key) => ({
      cacheName: key,
      remark: redisListType[key],
    }));
    ctx.state.formatData = newKeys;
    await next();
  } catch (error) {
    console.error('缓存列表', error);
    return ctx.app.emit('error', getListErr, ctx);
  }
};

// 查询 缓存键名
export const getCacheKeysMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const key = ctx.request.url.split('/')[ctx.request.url.split('/').length - 1];
    const keyList = await getSetsValue(key);
    ctx.state.formatData = keyList;
    await next();
  } catch (error) {
    console.error('缓存列表', error);
    return ctx.app.emit('error', getListErr, ctx);
  }
};

// 查询 缓存内容
export const getCacheContentMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const key = ctx.request.url.split('/')[ctx.request.url.split('/').length - 1];
    const keyList = key.split(':');
    const res = await queryKeyValue(keyList[1]);
    let newCacheValue = res as any;

    if (res !== null && typeof res === 'object') {
      newCacheValue = JSON.stringify(res);
    }

    ctx.state.formatData = {
      cacheName: keyList[0],
      cacheKey: keyList[1],
      cacheValue: newCacheValue || '',
    };
    await next();
  } catch (error) {
    console.error('缓存列表失败', error);
    return ctx.app.emit('error', getListErr, ctx);
  }
};

// 删除缓存
export const clearCacheKeyMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const key = ctx.request.url.split('/')[ctx.request.url.split('/').length - 1];
    if (key.indexOf(':') !== -1) {
      const newKey = key.split(':');
      // 删除集合内的值
      await removeSetKeys(newKey[0], [newKey[1]]);
      // 如果集合外有存值，则将集合外的值也删除掉
      if (await queryKeyValue(newKey[1])) {
        await removeKey([newKey[1]]);
      }
    } else {
      // 首先获取集合内的值
      const setKeys = await getSetsValue(key);
      // 删除由集合内值绑定集合外的所有值
      await removeKey(setKeys);
      // 删除该集合
      await removeSet(key, setKeys);
    }
    await next();
  } catch (error) {
    console.error('删除缓存失败', error);
    return ctx.app.emit('error', delErr, ctx);
  }
};

// 删除全部缓存
export const clearCacheAllMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    // 查询全部的缓存列表
    const sets = await querySetKeys();

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < sets.length; i++) {
      // 代码生成的sql redis不在清理之内
      if (sets[i] !== 'tool_sql_names') {
        // 获取结合内所有的值
        // eslint-disable-next-line no-await-in-loop
        const setKeys = await getSetsValue(sets[i]);
        // 删除由集合内值绑定集合外的所有值
        // eslint-disable-next-line no-await-in-loop
        await removeKey(setKeys);
        // 删除集合内所有的值
        // eslint-disable-next-line no-await-in-loop
        await removeSet(sets[i], setKeys);
      }
    }
    await next();
  } catch (error) {
    console.error('删除缓存失败', error);
    return ctx.app.emit('error', delErr, ctx);
  }
};
