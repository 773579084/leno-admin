/* global OpTypes */
// query
export interface genQueryType {
  pageNum: number;
  pageSize: number;
  tableName?: string;
  tableComment?: string;
  beginTime?: string;
  endTime?: string;
}
export interface genQuerySerType {
  pageNum: number;
  pageSize: number;
  table_name?: string;
  table_comment?: string;
  beginTime?: string;
  endTime?: string;
  created_at?: { [OpTypes.between]: string[] };
  is_import?: string;
  table_id?: string;
}
export interface genQueryDbSerType {
  pageNum: number;
  pageSize: number;
  table_name?: string;
  table_comment?: string;
  is_import?: string;
}

export interface sqlTableCoulmnsType {
  name: string;
  type: string;
  allowNull: string;
  defaultValue: string;
  comment: string;
  primaryKey: string;
  autoIncrement: string;
}

export interface ColumnType {
  key?: number;
  sort: number;
  columnId: number;
  tableId: number;
  columnName: string;
  columnComment: string;
  columnDefaultValue: string;
  columnType: string;
  tsType: string;
  tsField: string;
  isPk: string;
  isIncrement: string;
  isRequired: string;
  isInsert: string;
  isEdit: string;
  isList: string;
  isQuery: string;
  queryType: string;
  htmlType: string;
  dictType: string;
  createBy: string;
  updateBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenType {
  options: string;
  remark: string;
  tableId: number;
  columns?: ColumnType[];
  tableName: string;
  tableComment: string;
  subTableName: string;
  subTableFkName: string;
  className: string;
  tplCategory: string;
  packageName: string;
  moduleName: string;
  businessName: string;
  functionName: string;
  functionAuthor: string;
  genType: string;
  genPath: string;
  treeCode: string;
  treeParentCode: string;
  treeName: string;
  createBy?: string;
  updateBy?: string;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ColumnSerType {
  sort: number;
  column_id: number;
  table_id: number;
  column_name: string;
  column_comment: string;
  column_type: string;
  ts_type: string;
  ts_field: string;
  is_pk: string;
  is_increment: string;
  is_required: string;
  is_insert: string;
  is_edit: string;
  is_list: string;
  is_query: string;
  query_type: string;
  html_type: string;
  dict_type: string;
  create_by: string;
  update_by: string;
  created_at: string;
  updated_at: string;
}

export interface GenSerType {
  columns: ColumnSerType[];
  table_id: string;
  table_name: string;
  table_comment: string;
  class_name: string;
  function_author: string;
  remark: string;
  tpl_category: string;
  package_name: string;
  module_name: string;
  business_name: string;
  function_name: string;
  parent_id: number;
  gen_type: string;
  gen_path: string;
  tree_code: string;
  tree_parent_code: string;
  tree_name: string;
  sub_table_name: string;
  sub_table_fk_name: number;
}
