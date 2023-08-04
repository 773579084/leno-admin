import { DataTypes } from 'sequelize'
import seq from '@/mysql/db/seq.db'

// 创建数据库模型 通知公告与角色关联
const SysNoticeRole = seq.define(
  'sys_user_post',
  {
    notice_id: {
      type: DataTypes.BIGINT,
      comment: '通知ID'
    },
    role_id: {
      type: DataTypes.BIGINT,
      comment: '角色ID'
    }
  },
  {
    tableName: 'sys_notice_role', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '通知公告与角色关联表'
  }
)

export default SysNoticeRole
