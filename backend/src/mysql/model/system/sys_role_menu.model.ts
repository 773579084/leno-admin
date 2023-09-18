import { DataTypes } from 'sequelize';
import seq from '@/mysql/db/seq.db';

// 创建数据库模型 菜单与角色关联
const SysRoleMenu = seq.define(
  'sys_role_menu',
  {
    role_id: {
      type: DataTypes.BIGINT,
      comment: '角色ID',
    },
    menu_id: {
      type: DataTypes.BIGINT,
      comment: '菜单ID',
    },
  },
  {
    tableName: 'sys_role_menu', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '菜单与角色关联表',
  },
);

export default SysRoleMenu;
