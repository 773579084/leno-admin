import { DataTypes } from 'sequelize';
import seq from '@/mysql/db/seq.db';

// 创建数据库模型 操作日志记录
const SysOperLog = seq.define(
  'sys_oper_log',
  {
    oper_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
      comment: '日志主键',
    },
    title: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '模块标题',
    },
    business_type: {
      type: DataTypes.STRING,
      defaultValue: '0',
      comment: '操作类型（0其它 1新增 2修改 3删除）',
    },
    method: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '方法名称',
    },
    request_method: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '请求方式',
    },
    operator_type: {
      type: DataTypes.STRING,
      defaultValue: '0',
      comment: '操作类别（0其它 1后台用户 2手机端用户）',
    },
    oper_name: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '操作人员',
    },
    dept_name: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '部门名称',
    },
    oper_url: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '请求URL',
    },
    oper_ip: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '主机地址',
    },
    oper_location: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '操作地点',
    },
    oper_param: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '请求参数',
    },
    json_result: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '返回参数',
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: '0',
      comment: '操作状态（0正常 1异常）',
    },
    error_msg: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '错误消息',
    },
    oper_time: {
      type: DataTypes.DATE,
      defaultValue: null,
      comment: '操作时间',
    },
  },
  {
    tableName: 'sys_oper_log', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '操作日志记录',
  },
);

export default SysOperLog;
