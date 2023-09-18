/* global OpTypes */
// 菜单sql类型
export interface menusSqlType {
  menu_id: number;
  menu_name: string;
  parent_id: string;
  order_num: string;
  path: string;
  component: string;
  query: string;
  is_frame: string;
  is_cache: string;
  menu_type: string;
  visible: string;
  status: string;
  perms: string;
  icon: string;
  create_by: string;
  update_by: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
  updateBy?: string;
}
// 菜单类型
export interface menusType {
  path: string;
  component?: string;
  query?: string;
  visible: string;
  status: string;
  perms?: string;
  icon?: string;
  remark?: string;
  menuId?: number;
  menuName: string;
  parentId: number;
  orderNum: number;
  isFrame: number;
  isCache: number;
  menuType: string;
  createBy?: string;
  updateBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 返回路由
export interface Meta {
  title: string;
  icon: string;
  noCache: boolean;
  link?: null | string;
}

export interface RouteType {
  name: string;
  path: string;
  children?: RouteType[];
  hidden: boolean;
  element: string;
  alwaysShow?: boolean;
  meta: Meta;
}

// 搜索
export interface MenuParamsType {
  status?: string;
  menuName?: any;
  [OpTypes.in]?: number[];
}
