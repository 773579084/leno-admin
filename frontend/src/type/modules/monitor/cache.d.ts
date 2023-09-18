// 前端 类型文件

export interface Key {
  keys: number;
  expires: number;
  avg_ttl: number;
}
export interface Info {
  version: string;
  day: string;
  aof: string;
  type: string;
  memory: string;
  memoryShow: string;
  rdb: string;
  port: string;
  cpu: string;
  keys: Key;
  client: string;
  memoryTotal: string;
  ipEnter: string;
  ipOut: string;
}

export interface ICacheMonitoType {
  info: Info;
  commandStats: { name: string; value: string }[];
}
// 缓存监控信息
export interface ICacheMonitoAPI {
  code: number;
  message: string;
  result: ICacheMonitoType;
}

export interface ICacheListType {
  cacheName: string;
  remark: string;
}
// 缓存监控信息
export interface ICacheListAPI {
  code: number;
  message: string;
  result: ICacheListType[];
}

// 键名列表
export interface IKeysListAPI {
  code: number;
  message: string;
  result: string[];
}

export interface ICacheKeyType {
  cacheKey: string;
}

export interface ICacheContentType {
  cacheName: string;
  cacheKey: string;
  cacheValue: string;
  remark: string;
}

// 缓存内容
export interface ICacheContentAPI {
  code: number;
  message: string;
  result: ICacheContentType;
}
