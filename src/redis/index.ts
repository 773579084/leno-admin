import Redis from 'ioredis';
import env from '@/config/default';

const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD, REDIS_DB } = env();

export default new Redis({
  port: REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
  db: REDIS_DB,
  //  family:4  // 4 (IPv4) or 6 (IPv6)
});
