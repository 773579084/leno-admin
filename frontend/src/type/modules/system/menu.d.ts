/* eslint-disable no-undef */
// 路由
export interface Meta {
  title: string;
  icon: string;
  noCache: boolean;
  link?: null | string;
}

export interface RouteType {
  query?: string | undefined;
  name?: string;
  path?: string;
  perms?: string;
  children?: RouteType[];
  hidden?: boolean;
  element: string | JSX.Element | React.ReactNode;
  alwaysShow?: boolean;
  meta?: Meta;
}

export interface getRouterApiType {
  code: number;
  message: string;
  result?: RouteType[];
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
  menuId: number;
  menuName?: string;
  parentId?: number;
  orderNum: number;
  isFrame?: number;
  isCache?: number;
  menuType?: string;
  createBy?: string;
  updateBy?: string;
  createdAt?: string;
  updatedAt?: string;
  children?: any[];
}

export interface ILimitAPI {
  menuName?: string;
  status?: string;
}

export interface otherApiType {
  code: number;
  message: string;
  result?: menusType;
}

export interface menusApiType {
  code: number;
  message: string;
  result: menusType[];
}
