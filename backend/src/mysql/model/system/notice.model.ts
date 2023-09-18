import { DataTypes } from 'sequelize';
import seq from '@/mysql/db/seq.db';

// 创建数据库模型 通知公告表
const SysNotice = seq.define(
  'sys_notice',
  {
    notice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
      comment: '公告ID',
    },
    notice_title: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '公告标题',
    },
    notice_type: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '公告类型（1通知 2公告）',
    },
    notice_content: {
      type: DataTypes.TEXT,
      defaultValue: null,
      comment: '公告内容',
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: '0',
      comment: '公告状态（0正常 1关闭）',
    },
    imgs: {
      type: DataTypes.STRING,
      defaultValue: '',
      comment: '图片存储地址',
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
    tableName: 'sys_notice', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '通知公告表',
  },
);

export default SysNotice;
