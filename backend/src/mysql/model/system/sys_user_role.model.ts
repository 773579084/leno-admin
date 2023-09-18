import { DataTypes } from 'sequelize';
import seq from '@/mysql/db/seq.db';

// 创建数据库模型 用户与角色关联
const SysUserRole = seq.define(
  'sys_user_role',
  {
    user_id: {
      type: DataTypes.BIGINT,
      comment: '用户ID',
    },
    role_id: {
      type: DataTypes.BIGINT,
      comment: '角色ID',
    },
  },
  {
    tableName: 'sys_user_role', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '用户和角色关联表',
  },
);

export default SysUserRole;
