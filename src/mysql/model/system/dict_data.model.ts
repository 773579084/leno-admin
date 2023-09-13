import { DataTypes } from 'sequelize';
import seq from '@/mysql/db/seq.db';

// 创建数据库模型
const SysDictData = seq.define(
  'sys_dict_data',
  {
    dict_code: {
      type: DataTypes.BIGINT,
      allowNull: false, // 是否允许空
      unique: true, // 是否为独一无二的
      autoIncrement: true, // id 自动增加
      primaryKey: true, // 是否设置为主键
      comment: '部门id',
    },
    dict_sort: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      comment: '字典排序',
    },
    dict_label: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '字典标签',
    },
    dict_value: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '字典键值',
    },
    dict_type: {
      type: DataTypes.CHAR(255),
      defaultValue: '',
      comment: '字典类型',
    },
    css_class: {
      type: DataTypes.CHAR(255),
      defaultValue: null,
      comment: '样式属性（其他样式扩展）',
    },
    list_class: {
      type: DataTypes.CHAR(255),
      defaultValue: null,
      comment: '表格回显样式',
    },
    is_default: {
      type: DataTypes.CHAR(1),
      defaultValue: 'N',
      comment: '是否默认（Y是 N否）',
    },
    status: {
      type: DataTypes.CHAR(1),
      defaultValue: '0',
      comment: '状态（0正常 1停用）',
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
    remark: {
      type: DataTypes.CHAR(255),
      comment: '备注',
    },
  },
  {
    tableName: 'sys_dict_data', // 强制创建表名
    freezeTableName: true, // 告诉sequelize不需要自动将表名变成复数
    comment: '字典数据表',
  },
);

export default SysDictData;
