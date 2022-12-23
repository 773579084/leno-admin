import { DataTypes } from 'sequelize'
import seq from '../../db/seq.db'

// 创建数据库模型
const RoleDept = seq.define('sys_role_dept', {
  role_id: {
    type: DataTypes.BIGINT,
    allowNull: false, // 是否允许空
    comment: '角色ID'
  },
  dept_id: {
    type: DataTypes.BIGINT,
    allowNull: false, // 是否允许空
    comment: '部门ID'
  }
})

// 在数据库创建 数据表
// force: true 如果存在相同名字的表，删除旧的表，新建新的表
// RoleDept.sync()

export default RoleDept
