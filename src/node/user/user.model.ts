
import { DataTypes } from 'sequelize'
import seq from '@/mysql/db/seq.db'

// 创建数据库模型 用户信息表
const LenoUser = seq.define(
  'leno_user',
  {
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
        comment: "用户id"
      },
    dept_id: {
        type: DataTypes.BIGINT,
        defaultValue: null,
        comment: "部门ID"
      },
    user_name: {
        type: DataTypes.STRING,
        defaultValue: null,
        comment: "用户账号"
      },
    nick_name: {
        type: DataTypes.STRING,
        defaultValue: null,
        comment: "用户昵称"
      },
    user_type: {
        type: DataTypes.CHAR,
        defaultValue: 0,
        comment: "用户类型 0 管理员 , 1 非管理员"
      },
    email: {
        type: DataTypes.CHAR,
        defaultValue: null,
        comment: "用户邮箱"
      },
    phonenumber: {
        type: DataTypes.CHAR,
        defaultValue: null,
        comment: "手机号码"
      },
    sex: {
        type: DataTypes.CHAR,
        defaultValue: 0,
        comment: "用户性别，0男，1女"
      },
    avatar: {
        type: DataTypes.CHAR,
        defaultValue: null,
        comment: "头像地址"
      },
    password: {
        type: DataTypes.CHAR,
        defaultValue: null,
        comment: "用户密码"
      },
    status: {
        type: DataTypes.CHAR,
        defaultValue: 0,
        comment: "账号状态: 0 正常，1 停用"
      },
    del_flag: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        comment: "账号状态: 0 存在，1 删除"
      },
    login_ip: {
        type: DataTypes.CHAR,
        defaultValue: null,
        comment: "最后登录的 IP"
      },
    login_date: {
        type: DataTypes.TIME,
        defaultValue: null,
        comment: "最后登录的 时间"
      },
    create_by: {
        type: DataTypes.CHAR,
        defaultValue: null,
        comment: "创建者"
      },
    update_by: {
        type: DataTypes.CHAR,
        defaultValue: null,
        comment: "更新者"
      },
    remark: {
        type: DataTypes.CHAR,
        defaultValue: null,
        comment: "备注"
      },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: null,
        comment: ""
      },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: null,
        comment: ""
      },

  },
  {
    tableName: 'leno_user', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '用户信息表'
  }
)

export default LenoUser