import redis from 'ioredis'
const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD, REDIS_DB } = process.env as any

export default new redis({
  port: REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
  db: REDIS_DB
  //  family:4  // 4 (IPv4) or 6 (IPv6)
})
