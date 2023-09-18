/* global OpTypes */
// sys_dict_data query
export interface dictDataQueryType {
  pageNum: number;
  pageSize: number;
  dictLabel?: string;
  dictType?: string;
  status?: string;
}
export interface dictDataQuerySerType {
  pageNum: number;
  pageSize: number;
  dict_label?: string | { [OpTypes.like]: string };
  dict_name?: string;
  dict_type?: string;
  dict_value?: string;
  css_class?: string;
  list_class?: string;
  dict_sort?: number;
  status?: string;
  created_at?: string;
}
export interface IdictData {
  dictCode?: number;
  dictName?: string;
  dictSort?: number;
  dictLabel?: string;
  dictValue?: string;
  dictType?: string;
  cssClass?: string;
  listClass?: string;
  isDefault?: string;
  status?: string;
  createBy?: string;
  updateBy?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface IdictDataSer {
  dict_code?: number;
  dict_name?: string;
  dict_sort?: number;
  dict_label?: string;
  dict_value?: string;
  dict_type?: string;
  css_class?: string;
  list_class?: string;
  is_default?: string;
  status?: string;
  createBy?: string;
  updateBy?: string;
  update_by?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}
