import { DataTypes } from 'sequelize'
import seq from '@/db/seq.db'

// 创建数据库模型 用户与岗位关联
const UserRost = seq.define(
  'sys_user_post',
  {
    user_id: {
      type: DataTypes.BIGINT,
      comment: '用户ID'
    },
    post_id: {
      type: DataTypes.BIGINT,
      comment: '岗位ID'
    }
  },
  {
    tableName: 'sys_user_post', // 强制创建表名
    freezeTableName: true // 告诉sequelize不需要自动将表名变成复数
  }
)

export default UserRost
