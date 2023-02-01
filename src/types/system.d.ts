// 基础菜单类型
export interface menusType {
  menu_id: string
  menu_name: string
  parent_id: string
  order_num: string
  path: string
  component: string
  query: string
  is_frame: string
  is_cache: string
  menu_type: string
  visible: string
  status: string
  perms: string
  icon: string
  create_by: string
  update_by: string
  remark: string
  createdAt: string
  updatedAt: string
}

// 部门类型
export interface deptType {
  dept_id: number
  parent_id: number
  dept_name: string
  order_num: number
  leader: string
  phone: string
  email: string
  status: string
  del_flag: string
  create_by: string
  update_by: string
  createdAt: string
  updatedAt: string
}
