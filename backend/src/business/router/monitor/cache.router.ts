import Router from 'koa-router';
import IndexCon from '@/business/controller';
import { getCacheMid, getCacheListMid, getCacheKeysMid, getCacheContentMid, clearCacheAllMid, clearCacheKeyMid } from '@/business/middleware/monitor/cache.middleware';
import { hasPermi } from '@/business/middleware/common/auth';

const router = new Router({ prefix: '/monitor' });

// 查询 缓存监控信息
router.get('/cache', hasPermi('monitor:cache:list'), getCacheMid, IndexCon());

// 查询 缓存列表
router.get('/cacheList', hasPermi('monitor:cacheList:list'), getCacheListMid, IndexCon());

// 查询 缓存键名
router.get('/cacheKeys/:id', hasPermi('monitor:cacheList:list'), getCacheKeysMid, IndexCon());

// 查询 缓存内容
router.get('/cacheContent/:id', hasPermi('monitor:cacheList:list'), getCacheContentMid, IndexCon());

// 删除 缓存
router.delete('/clearCacheKey/:id', hasPermi('monitor:cacheList:list'), clearCacheKeyMid, IndexCon());

// 删除 全部缓存
router.delete('/clearCache/clean', hasPermi('monitor:cacheList:list'), clearCacheAllMid, IndexCon());

export default router;
