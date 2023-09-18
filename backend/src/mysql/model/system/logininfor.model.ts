import { DataTypes } from 'sequelize';
import seq from '@/mysql/db/seq.db';

// 创建数据库模型 登录日志
const SysLogininfor = seq.define(
  'sys_logininfor',
  {
    info_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
      comment: '访问ID',
    },
    user_name: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '用户账号',
    },
    ipaddr: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '登录IP地址',
    },
    login_location: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '登录地点',
    },
    browser: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '浏览器类型',
    },
    os: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '操作系统',
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '登录状态（0成功 1失败）',
    },
    msg: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '提示消息',
    },
    login_time: {
      type: DataTypes.DATE,
      defaultValue: null,
      comment: '访问时间',
    },
  },
  {
    tableName: 'sys_logininfor', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '登录日志',
  },
);

export default SysLogininfor;
