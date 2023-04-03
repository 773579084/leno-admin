// sys_dict_data query
export interface dictDataQueryType {
  pageNum: number
  pageSize: number
  dictLabel?: string
  dictType?: string
  status?: string
}
export interface dictDataQuerySerType {
  pageNum: number
  pageSize: number
  dict_label?: string
  dict_name?: string
  dict_type?: string
  dict_value?: string
  css_class?: string
  list_class?: string
  dict_sort?: number
  status?: string
  created_at?: any
}
export interface IdictData {
  dictCode?: number
  dictName?: string
  dictSort?: number
  dictLabel?: string
  dictValue?: string
  dictType?: string
  cssClass?: string
  listClass?: string
  isDefault?: string
  status?: string
  createBy?: string
  updateBy?: string
  remark?: string
  createdAt?: string
  updatedAt?: string
}
export interface dictDataListType {
  count: number
  rows: IdictType[]
}
