/* global OpTypes */
// 后端 类型文件
export interface IdeptQueryType {
  pageNum: number;
  pageSize: number;
  deptId?: number;
  parentId?: number;
  ancestors?: string;
  deptName?: string;
  orderNum?: number;
  leader?: string;
  phone?: string;
  email?: string;
  status?: string;
  delFlag?: string;
  createBy?: string;
  updateBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IdeptQuerySerType {
  pageNum: number;
  pageSize: number;
  dept_name?: { [OpTypes.like]: string };
  del_flag?: { [OpTypes.eq]: string };
  status?: { [OpTypes.eq]: string };
}

export interface Idept {
  deptName?: string;
  orderNum?: number;
  leader?: string;
  phone?: string;
  email?: string;
  status?: string;
}

export interface IdeptSer {
  dept_id?: number;
  parent_id?: number;
  ancestors?: string;
  dept_name?: string;
  order_num?: number;
  leader?: string;
  phone?: string;
  email?: string;
  status?: string;
  del_flag?: string;
  create_by?: string;
  update_by?: string;
  created_at?: string;
  updated_at?: string;
}
