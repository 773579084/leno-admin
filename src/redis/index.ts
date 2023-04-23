import redis from './redis'

/**
 * 选择数据库
 * @param DbName
 * @returns
 */
const selectDb = (DbName: number = 0) => {
  return new Promise<void>((resolve, reject) => {
    try {
      redis.select(DbName)
    } catch (error) {
      console.error('redis选择数据库出错', error)
    }
  })
}
export default selectDb
