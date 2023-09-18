/* global OpTypes */
// 后端 类型文件
export interface IconfigQueryType {
  pageNum: number;
  pageSize: number;
  configId?: number;
  configName?: string;
  configKey?: string;
  configValue?: string;
  configType?: string;
  createBy?: string;
  createdAt?: {
    beginTime: string;
    endTime: string;
  };
  updateBy?: string;
  updatedAt?: string;
  remark?: string;
}

export interface IconfigQuerySerType {
  pageNum: number;
  pageSize: number;
  config_name?: { [OpTypes.like]: string };
  config_key?: { [OpTypes.like]: string };
  config_type?: { [OpTypes.eq]: string };
  created_at?: { [OpTypes.between]: string };
}

export interface Iconfig {
  configName?: string;
  configKey?: string;
  configValue?: string;
  configType?: string;
  remark?: string;
}

export interface IconfigSer {
  config_id?: number;
  config_name?: string;
  config_key?: string;
  config_value?: string;
  config_type?: string;
  create_by?: string;
  created_at?: string;
  update_by?: string;
  updated_at?: string;
  remark?: string;
}
