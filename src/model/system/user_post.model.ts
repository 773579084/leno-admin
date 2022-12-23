import { DataTypes } from 'sequelize'
import seq from '../../db/seq.db'

// 创建数据库模型
const UserPost = seq.define('sys_user_post', {
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false, // 是否允许空
    comment: '用户ID'
  },
  post_id: {
    type: DataTypes.BIGINT,
    allowNull: false, // 是否允许空
    comment: '岗位ID'
  }
})

// 在数据库创建 数据表
// force: true 如果存在相同名字的表，删除旧的表，新建新的表
// UserPost.sync()

export default UserPost
