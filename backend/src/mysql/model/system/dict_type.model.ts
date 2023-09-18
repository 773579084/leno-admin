import { DataTypes } from 'sequelize';
import seq from '@/mysql/db/seq.db';

// 创建数据库模型 字典类型表
const SysDictType = seq.define(
  'sys_dict_type',
  {
    dict_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // 是否允许空
      unique: true, // 是否为独一无二的
      autoIncrement: true, // id 自动增加
      primaryKey: true, // 是否设置为主键
      comment: '字典主键',
    },
    dict_name: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '字典名称',
    },
    dict_type: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '字典类型',
    },
    status: {
      type: DataTypes.CHAR(1),
      defaultValue: '0',
      comment: '状态（0正常 1停用）',
    },
    create_by: {
      type: DataTypes.CHAR(64),
      defaultValue: null,
      comment: '创建者',
    },
    update_by: {
      type: DataTypes.CHAR(64),
      defaultValue: null,
      comment: '更新者',
    },
    remark: {
      type: DataTypes.CHAR(255),
      comment: '备注',
    },
  },
  {
    tableName: 'sys_dict_type', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '字典类型表',
  },
);

export default SysDictType;
