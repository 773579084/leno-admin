/* eslint-disable no-undef */
// 设置 用户 角色信息
export interface IputUserAuthParamType {
  userId: string;
  roleIds: React.Key[];
}

// 新增，修改，删除 成功返回
export interface IsuccessTypeAPI {
  code: number;
  message: string;
  result?: null;
}
