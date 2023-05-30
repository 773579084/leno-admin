
import { DataTypes } from 'sequelize'
import seq from '@/mysql/db/seq.db'

// 创建数据库模型 岗位信息表
const SysPost = seq.define(
  'sys_post',
  {
    post_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
        comment: "部门id"
      },
    post_code: {
        type: DataTypes.CHAR,
        defaultValue: null,
        comment: "岗位编码"
      },
    post_name: {
        type: DataTypes.CHAR,
        defaultValue: null,
        comment: "岗位名称"
      },
    post_sort: {
        type: DataTypes.BIGINT,
        defaultValue: null,
        comment: "显示顺序"
      },
    status: {
        type: DataTypes.CHAR,
        defaultValue: 0,
        comment: "岗位状态（0正常 1停用）"
      },
    del_flag: {
        type: DataTypes.CHAR,
        defaultValue: 0,
        comment: "删除标志（0代表存在 2代表删除）"
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
        comment: "创建时间"
      },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: null,
        comment: "更新时间"
      },

  },
  {
    tableName: 'sys_post', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '岗位信息表'
  }
)

export default SysPost