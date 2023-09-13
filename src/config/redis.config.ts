// redis 的命令行类型
export const redisType = {
  set: 'set',
  sadd: 'sadd',
  expire: 'expire',
  smembers: 'smembers',
  srem: 'srem',
  del: 'del',
  get: 'get',
  mget: 'mget',
  info: 'info',
  keys: 'keys',
  type: 'type',
  exists: 'exists',
};

// redis 集合类型 key 含义
export const redisListType = {
  // tool_sql_names: 'sql表',
  login_tokens: '用户信息',
  update_userInfo: '用户信息待更新id',
};
