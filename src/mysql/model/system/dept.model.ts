import { DataTypes } from 'sequelize';
import seq from '@/mysql/db/seq.db';

// 创建数据库模型
const SysDept = seq.define(
  'sys_dept',
  {
    dept_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // 是否允许空
      unique: true, // 是否为独一无二的
      autoIncrement: true, // id 自动增加
      primaryKey: true, // 是否设置为主键
      comment: '部门id',
    },
    parent_id: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      comment: '父部门id',
    },
    ancestors: {
      type: DataTypes.CHAR(50),
      defaultValue: '',
      comment: '祖级列表',
    },
    dept_name: {
      type: DataTypes.CHAR(255),
      defaultValue: null,
      comment: '部门名称',
    },
    order_num: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      comment: '显示顺序',
    },
    leader: {
      type: DataTypes.CHAR(255),
      defaultValue: null,
      comment: '负责人',
    },
    phone: {
      type: DataTypes.CHAR(255),
      defaultValue: null,
      comment: '联系电话',
    },
    email: {
      type: DataTypes.CHAR(255),
      defaultValue: null,
      comment: '邮箱',
    },
    status: {
      type: DataTypes.CHAR(1),
      defaultValue: '0',
      comment: '部门状态（0正常 1停用）',
    },
    del_flag: {
      type: DataTypes.CHAR(1),
      defaultValue: '0',
      comment: '删除标志（0代表存在 1代表删除）',
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
  },
  {
    tableName: 'sys_dept', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '部门表',
  },
);

export default SysDept;
