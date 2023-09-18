export interface ICodePreviewAPI {
  code: number;
  message: string;
  result: any;
}

export interface IPreview {
  label: string;
  key: string;
  children: any;
}

export interface ColumnType {
  key?: number;
  sort: number;
  columnId: number;
  tableId: number;
  columnName: string;
  columnComment: string;
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
  parentId?: number;
  treeName: string;
  createBy?: any;
  updateBy?: any;
  createdAt: string;
  updatedAt: string;
}

export interface GenTableType {
  tableId: number;
  tableName: string;
  tableComment: string;
  createdAt: string;
  updatedAt: string;
}

// 查询页数
export interface ILimitAPI {
  pageNum: number;
  pageSize: number;
  tableName?: string;
  tableComment?: string;
  beginTime?: string;
  endTime?: string;
}

export interface importTableLimitType {
  pageNum: number;
  pageSize: number;
  tableName?: string;
  tableComment?: string;
}
export interface IgetListAPI {
  code: number;
  message: string;
  result: {
    count: number;
    rows: GenType[];
  };
}
