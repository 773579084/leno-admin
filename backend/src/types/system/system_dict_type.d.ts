/* global OpTypes */
// sys_dict_type query
export interface dictTypeQueryType {
  pageNum: number;
  pageSize: number;
  dictName?: string;
  dictType?: string;
  status?: string;
  beginTime?: string;
  endTime?: string;
}
export interface dictTypeQuerySerType {
  pageNum: number;
  pageSize: number;
  dict_name?: string | { [OpTypes.like]: string };
  dict_type?: string | { [OpTypes.like]: string };
  status?: string;
  beginTime?: string;
  endTime?: string;
  created_at?: string | { [OpTypes.like]: string };
}
export interface IdictType {
  dictId?: number;
  dictName?: string;
  dictType?: string;
  status?: string;
  createBy?: string;
  updateBy?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface IdictSerType {
  dict_id?: string;
  dict_name?: string;
  dict_type?: string;
  status?: string;
  create_by?: string;
  update_by?: string;
  remark?: string;
  created_at?: string;
  updated_at?: string;
}
