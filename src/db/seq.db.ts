import { Sequelize } from 'sequelize'

import mysql from '@/config/config.default'
const { MYSQL_HOST, MYSQL_USER, MYSQL_PWD, MYSQL_DB } = mysql

const seq = new Sequelize(MYSQL_DB as string, MYSQL_USER as string, MYSQL_PWD as string, {
  host: MYSQL_HOST,
  dialect: 'mysql',
  // 设置北京时间
  timezone: '+08:00',
  logging: true, // logging: true, 打印sql到控制台
  define: {
    // create_time && update_time
    timestamps: true,
    createdAt: 'created_at', //自定义时间戳
    updatedAt: 'updated_at',
    // delete_time
    // paranoid: true,
    // deletedAt: 'deleted_at',
    // 把驼峰命名转换为下划线
    underscored: true,
    pool: {
      // 使用连接池
      max: 5, // 连接池中最大连接数量
      min: 0, // 连接池中最小连接数量
      acquire: 30000,
      idle: 10000 // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
    }
  } as any
})

// 开发环境
seq
  .authenticate()
  .then(() => {
    console.log('数据库连接成功')
  })
  .catch((err) => {
    console.log('数据库连接失败', err)
  })

export default seq
