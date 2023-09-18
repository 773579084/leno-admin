/* global OpTypes */
// 后端 类型文件
export interface IroleQueryType {
  pageNum: number;
  pageSize: number;
  roleId?: number;
  roleName?: string;
  roleKey?: string;
  roleSort?: number;
  dataScope?: string;
  status?: string;
  delFlag?: string;
  createBy?: string;
  updateBy?: string;
  remark?: string;
  createdAt?: {
    beginTime: string;
    endTime: string;
  };
  updatedAt?: string;
}

export interface IroleQuerySerType {
  pageNum: number;
  pageSize: number;
  del_flag?: string;
  role_name?: { [OpTypes.like]: string };
  role_key?: { [OpTypes.like]: string };
  status?: { [OpTypes.eq]: string };
  created_at?: { [OpTypes.between]: string };
}

export interface Irole {
  roleName?: string;
  roleKey?: string;
  roleSort?: number;
  status?: string;
  remark?: string;
  menuIds?: number[];
}

export interface IroleSer {
  role_id?: number;
  role_name?: string;
  role_key?: string;
  del_flag?: string;
  role_sort?: number;
  status?: string;
  remark?: string;
  update_by?: string;
}

export interface IroleMenuType {
  id: number;
  role_id: number;
  menu_id: number;
}
