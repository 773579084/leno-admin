import { DataTypes } from 'sequelize';
import seq from '@/mysql/db/seq.db';

// 创建数据库模型 定时任务调度表
const MonitorJob = seq.define(
  'monitor_job',
  {
    concurrent: {
      type: DataTypes.STRING,
      defaultValue: 1,
      comment: '是否并发执行（0允许 1禁止）',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: null,
      comment: '创建时间',
    },
    create_by: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '创建者',
    },
    cron_expression: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: 'cron执行表达式',
    },
    invoke_target: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '调用目标字符串',
    },
    job_group: {
      type: DataTypes.STRING,
      defaultValue: 'DEFAULT',
      comment: '任务组名',
    },
    job_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
      comment: '任务ID',
    },
    job_name: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '任务名称',
    },
    misfire_policy: {
      type: DataTypes.STRING,
      defaultValue: 3,
      comment: '执行策略（1立即执行 2执行一次 3放弃执行）',
    },
    remark: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '备注信息',
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 0,
      comment: '状态（0正常 1暂停）',
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: null,
      comment: '更新时间',
    },
    update_by: {
      type: DataTypes.STRING,
      defaultValue: null,
      comment: '更新者',
    },
  },
  {
    tableName: 'monitor_job', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '定时任务调度表',
  },
);

export default MonitorJob;
