import { DataTypes } from 'sequelize'
import seq from '@/db/seq.db'

// 创建数据库模型
const Menu = seq.define(
  'sys_menu',
  {
    menu_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // 是否允许空
      unique: true, // 是否为独一无二的
      autoIncrement: true, // id 自动增加
      primaryKey: true, // 是否设置为主键
      comment: '菜单ID'
    },
    menu_name: {
      type: DataTypes.STRING,
      allowNull: false, // 是否允许空
      comment: '菜单名称'
    },
    parent_id: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      comment: '父菜单ID'
    },
    order_num: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      comment: '显示顺序'
    },
    path: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '路由地址'
    },
    component: {
      type: DataTypes.CHAR(255),
      comment: '组件路径'
    },
    query: {
      type: DataTypes.CHAR(255),
      comment: '路由参数'
    },
    is_frame: {
      type: DataTypes.BIGINT,
      defaultValue: 1,
      comment: '是否为外链（0是 1否）'
    },
    is_cache: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      comment: '是否缓存（0缓存 1不缓存）'
    },
    menu_type: {
      type: DataTypes.CHAR(1),
      defaultValue: '',
      comment: '菜单类型（M目录 C菜单 F按钮)'
    },
    visible: {
      type: DataTypes.CHAR(1),
      defaultValue: 0,
      comment: '菜单状态（0显示 1隐藏）'
    },
    status: {
      type: DataTypes.CHAR(1),
      defaultValue: 0,
      comment: '菜单状态（0正常 1停用）'
    },
    perms: {
      type: DataTypes.CHAR(100),
      defaultValue: null,
      comment: '权限标识'
    },
    icon: {
      type: DataTypes.CHAR(100),
      defaultValue: '',
      comment: '菜单图标'
    },
    create_by: {
      type: DataTypes.CHAR(64),
      defaultValue: '',
      comment: '创建者'
    },
    update_by: {
      type: DataTypes.CHAR(64),
      defaultValue: '',
      comment: '更新者'
    },
    remark: {
      type: DataTypes.CHAR(255),
      comment: '备注'
    }
  },
  {
    tableName: 'sys_menu' // 强制创建表名
  }
)

// 在数据库创建 数据表
// force: true 如果存在相同名字的表，删除旧的表，新建新的表
Menu.sync()

export default Menu
