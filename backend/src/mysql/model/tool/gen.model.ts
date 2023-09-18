import { DataTypes } from 'sequelize';
import seq from '@/mysql/db/seq.db';

// 创建数据库模型
const ToolGen = seq.define(
  'tool_gen',
  {
    table_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // 是否允许空
      unique: true, // 是否为独一无二的
      autoIncrement: true, // id 自动增加
      primaryKey: true, // 是否设置为主键
      comment: '编号',
    },
    table_name: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '表名称',
    },
    table_comment: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '表描述',
    },
    sub_table_name: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '关联子表的表名',
    },
    sub_table_fk_name: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '子表关联的外键名',
    },
    class_name: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '实体类名称',
    },
    tpl_category: {
      type: DataTypes.CHAR(255),
      defaultValue: 'crud',
      comment: '使用的模板（crud单表操作 tree树表操作 sub主子表）',
    },
    package_name: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '生成包路径',
    },
    module_name: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '生成模块名',
    },
    business_name: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '生成业务名',
    },
    function_name: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '生成功能名',
    },
    function_author: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '生成功能作者',
    },
    gen_type: {
      type: DataTypes.CHAR(1),
      defaultValue: '0',
      comment: '生成代码方式（0zip压缩包 1自定义路径）',
    },
    is_import: {
      type: DataTypes.CHAR(1),
      defaultValue: '1',
      comment: '数据库表是否导入（0导入，1未导入）',
    },
    gen_path: {
      type: DataTypes.CHAR(255),
      defaultValue: '/',
      comment: '生成路径（不填默认项目路径）',
    },
    options: {
      type: DataTypes.CHAR(255),
      defaultValue: '0',
      comment: '其它生成选项',
    },
    tree_code: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '树编码字段',
    },
    tree_parent_code: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '树父编码字段',
    },
    tree_name: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '树名称字段',
    },
    parent_id: {
      type: DataTypes.BIGINT,
      comment: '上级菜单Id',
    },
    remark: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '备注',
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
  },
  {
    tableName: 'tool_gen', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '代码生成表',
  },
);

export default ToolGen;
