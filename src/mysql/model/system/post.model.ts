import { DataTypes } from 'sequelize';
import seq from '@/mysql/db/seq.db';

// 创建数据库模型
const SysPost = seq.define(
  'sys_post',
  {
    post_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // 是否允许空
      unique: true, // 是否为独一无二的
      autoIncrement: true, // id 自动增加
      primaryKey: true, // 是否设置为主键
      comment: '部门id',
    },
    post_code: {
      type: DataTypes.CHAR(255),
      defaultValue: null,
      comment: '岗位编码',
    },
    post_name: {
      type: DataTypes.CHAR(255),
      defaultValue: null,
      comment: '岗位名称',
    },
    post_sort: {
      type: DataTypes.BIGINT,
      defaultValue: null,
      comment: '显示顺序',
    },
    status: {
      type: DataTypes.CHAR(1),
      defaultValue: '0',
      comment: '岗位状态（0正常 1停用）',
    },
    del_flag: {
      type: DataTypes.CHAR(1),
      defaultValue: '0',
      comment: '删除标志（0代表存在 2代表删除）',
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
    tableName: 'sys_post', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '岗位信息表',
  },
);

export default SysPost;
