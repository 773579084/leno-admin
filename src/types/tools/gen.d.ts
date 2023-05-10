// query
export interface genQueryType {
  pageNum: number
  pageSize: number
  tableName?: string
  tableComment?: string
  beginTime?: string
  endTime?: string
}
export interface genQuerySerType {
  pageNum: number
  pageSize: number
  table_name?: string
  table_comment?: string
  beginTime?: string
  endTime?: string
  created_at?: any
}

export interface sqlTableCoulmnsType {
  name: string
  type: string
  allowNull: string
  defaultValue: any
  comment: string
  primaryKey: string
}
