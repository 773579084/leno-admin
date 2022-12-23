import { DataTypes } from 'sequelize'
import seq from '../../db/seq.db'

// 创建数据库模型
const UserRole = seq.define('sys_user_role', {
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false, // 是否允许空
    comment: '用户ID'
  },
  role_id: {
    type: DataTypes.BIGINT,
    allowNull: false, // 是否允许空
    comment: '角色ID'
  }
})

// 在数据库创建 数据表
// force: true 如果存在相同名字的表，删除旧的表，新建新的表
// UserRole.sync()

export default UserRole
