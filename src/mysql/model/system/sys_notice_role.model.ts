import { DataTypes } from 'sequelize'
import seq from '@/mysql/db/seq.db'

const SysNoticeDept = seq.define(
  'sys_user_post',
  {
    notice_id: {
      type: DataTypes.BIGINT,
      comment: '通知ID'
    },
    dept_id: {
      type: DataTypes.BIGINT,
      comment: '部门ID'
    }
  },
  {
    tableName: 'sys_notice_dept', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '通知公告与部门关联表'
  }
)

export default SysNoticeDept
