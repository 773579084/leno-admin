/* global OpTypes */
// 后端 类型文件
export interface IpostQueryType {
  pageNum: number;
  pageSize: number;
  postId?: number;
  postCode?: string;
  postName?: string;
  postSort?: number;
  status?: string;
  delFlag?: string;
  createBy?: string;
  updateBy?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IpostQuerySerType {
  pageNum: number;
  pageSize: number;
  post_code?: { [OpTypes.like]: string };
  post_name?: { [OpTypes.like]: string };
  status?: { [OpTypes.eq]: string };
  del_flag?: { [OpTypes.eq]: string };
}

export interface Ipost {
  postCode?: string;
  postName?: string;
  postSort?: number;
  status?: string;
  remark?: string;
}

export interface IpostSer {
  post_id?: number;
  post_code?: string;
  post_name?: string;
  post_sort?: number;
  status?: string;
  del_flag?: string;
  create_by?: string;
  update_by?: string;
  remark?: string;
  created_at?: string;
  updated_at?: string;
}
