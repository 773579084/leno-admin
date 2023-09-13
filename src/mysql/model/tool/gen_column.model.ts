import { DataTypes } from 'sequelize';
import seq from '@/mysql/db/seq.db';

// 创建数据库模型
const ToolGenColumn = seq.define(
  'tool_gen_column',
  {
    column_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // 是否允许空
      unique: true, // 是否为独一无二的
      autoIncrement: true, // id 自动增加
      primaryKey: true, // 是否设置为主键
      comment: '编号',
    },
    table_id: {
      type: DataTypes.BIGINT,
      comment: '归属表编号',
    },
    column_name: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '列名称',
    },
    column_comment: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '列描述',
    },
    column_type: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '列类型',
    },
    column_default_value: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '字段默认值',
    },
    ts_type: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: 'ts类型',
    },
    ts_field: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: 'ts属性',
    },
    is_pk: {
      type: DataTypes.CHAR(1),
      defaultValue: '1',
      comment: '是否主键（0是）',
    },
    is_increment: {
      type: DataTypes.CHAR(1),
      defaultValue: '1',
      comment: '是否自增（0是）',
    },
    is_required: {
      type: DataTypes.CHAR(1),
      defaultValue: '1',
      comment: '是否必填（0是）',
    },
    is_insert: {
      type: DataTypes.CHAR(1),
      defaultValue: '1',
      comment: '是否为新增字段（0是）',
    },
    is_edit: {
      type: DataTypes.CHAR(1),
      defaultValue: '1',
      comment: '是否编辑字段（0是）',
    },
    is_list: {
      type: DataTypes.CHAR(1),
      defaultValue: '1',
      comment: '是否列表字段（0是）',
    },
    is_query: {
      type: DataTypes.CHAR(1),
      defaultValue: '1',
      comment: '是否查询字段（0是）',
    },
    query_type: {
      type: DataTypes.CHAR(255),
      defaultValue: 'eq',
      comment: '查询方式（等于、不等于、大于、小于、范围）',
    },
    html_type: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '显示类型（文本框、文本域、下拉框、复选框、单选框、日期控件）',
    },
    dict_type: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '字典类型',
    },
    sort: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      comment: '排序',
    },
    create_by: {
      type: DataTypes.CHAR(64),
      defaultValue: '',
      comment: '创建者',
    },
    update_by: {
      type: DataTypes.CHAR(64),
      defaultValue: '',
      comment: '更新者',
    },
  },
  {
    tableName: 'tool_gen_column', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '代码生成字段表',
  },
);

export default ToolGenColumn;
