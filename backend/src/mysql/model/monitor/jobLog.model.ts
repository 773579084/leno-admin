import { DataTypes } from 'sequelize';
import seq from '@/mysql/db/seq.db';

// 创建数据库模型 定时任务调度日志表
const MonitorJobLog = seq.define(
  'monitor_job_log',
  {
    created_at: {
      type: DataTypes.DATE,
      defaultValue: null,
      comment: '创建时间',
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: null,
      comment: '修改时间',
    },
    exception_info: {
      type: DataTypes.TEXT,
      defaultValue: null,
      comment: '异常信息',
    },
    invoke_target: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '调用目标字符串',
    },
    job_group: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '任务组名',
    },
    job_log_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
      comment: '任务日志ID',
    },
    job_message: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '日志信息',
    },
    job_name: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '任务名称',
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 0,
      comment: '执行状态（0正常 1失败）',
    },
  },
  {
    tableName: 'monitor_job_log', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '定时任务调度日志表',
  },
);

export default MonitorJobLog;
