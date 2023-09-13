import { DataTypes } from 'sequelize';
import seq from '@/mysql/db/seq.db';

// 创建数据库模型
const LenoUser = seq.define(
  'leno_user',
  {
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // 是否允许空
      unique: true, // 是否为独一无二
      autoIncrement: true,
      primaryKey: true, // 是否设置为主键
      comment: '用户id',
    },
    dept_id: {
      type: DataTypes.BIGINT,
      comment: '部门ID',
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false, // 是否允许空
      unique: true, // 是否为独一无二的
      comment: '用户账号',
    },
    nick_name: {
      type: DataTypes.STRING,
      comment: '用户昵称',
    },
    user_type: {
      type: DataTypes.CHAR(1),
      defaultValue: '0',
      comment: '用户类型 0 管理员 , 1 非管理员 ',
    },
    email: {
      type: DataTypes.CHAR(50),
      comment: '用户邮箱',
    },
    phonenumber: {
      type: DataTypes.CHAR(11),
      comment: '手机号码',
    },
    sex: {
      type: DataTypes.CHAR(1),
      defaultValue: '0',
      comment: '用户性别，0男，1女',
    },
    avatar: {
      type: DataTypes.CHAR(255),
      comment: '头像地址',
    },
    password: {
      type: DataTypes.CHAR(64),
      allowNull: false,
      comment: '用户密码',
    },
    status: {
      type: DataTypes.CHAR(1),
      defaultValue: '0',
      comment: '账号状态: 0 正常，1 停用',
    },
    del_flag: {
      type: DataTypes.CHAR(1),
      defaultValue: 0,
      comment: '账号状态: 0 存在，1 删除',
    },
    login_ip: {
      type: DataTypes.CHAR(128),
      comment: '最后登录的 IP',
    },
    login_date: {
      type: DataTypes.TIME,
      comment: '最后登录的 时间',
    },
    create_by: {
      type: DataTypes.CHAR(64),
      comment: '创建者',
    },
    update_by: {
      type: DataTypes.CHAR(64),
      comment: '更新者',
    },
    remark: {
      type: DataTypes.CHAR(255),
      comment: '备注',
    },
  },
  {
    tableName: 'leno_user', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '用户信息表',
  },
);

export default LenoUser;
