// 基础菜单类型
export interface menusType {
  menu_id: string | null
  menu_name: string | null
  parent_id: string | null
  order_num: string | null
  path: string | null
  component: string | null
  query: string | null
  is_frame: string | null
  is_cache: string | null
  menu_type: string | null
  visible: string | null
  status: string | null
  perms: string | null
  icon: string | null
  create_by: string | null
  update_by: string | null
  remark: string | null
  createdAt: string | null
  updatedAt: string | null
}

// 部门类型
export interface deptType {
  deptId: string | null
  parentId: string | null
  ancestors: string | null
  deptName: string | null
  orderNum: string | null
  leader: string | null
  phone: string | null
  email: string | null
  status: string | null
  delFlag: string | null
  createBy: string | null
  updateBy: string | null
  createdAt: string | null
  updatedAt: string | null
}
