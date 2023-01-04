import { Sequelize } from 'sequelize'

import mysql from '../config/config.default'
const { MYSQL_HOST, MYSQL_USER, MYSQL_PWD, MYSQL_DB } = mysql

const seq = new Sequelize(MYSQL_DB as string, MYSQL_USER as string, MYSQL_PWD as string, {
  host: MYSQL_HOST,
  dialect: 'mysql',
  // 设置北京时间
  timezone: '+8:00'
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
