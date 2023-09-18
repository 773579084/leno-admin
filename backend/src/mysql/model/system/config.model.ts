import { DataTypes } from 'sequelize';
import seq from '@/mysql/db/seq.db';

// 创建数据库模型 参数配置表
const SysConfig = seq.define(
  'sys_config',
  {
    config_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
      comment: '参数主键',
    },
    config_name: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '参数名称',
    },
    config_key: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '参数键名',
    },
    config_value: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '参数键值',
    },
    config_type: {
      type: DataTypes.STRING,
      defaultValue: 'N',
      comment: '系统内置（Y是 N否）',
    },
    create_by: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '创建者',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: null,
      comment: '创建时间',
    },
    update_by: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '更新者',
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: null,
      comment: '更新时间',
    },
    remark: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '备注',
    },
  },
  {
    tableName: 'sys_config', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '参数配置表',
  },
);

export default SysConfig;
