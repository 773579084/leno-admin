/* global OpTypes */
// 后端 类型文件
export interface InoticeQueryType {
  pageNum: number;
  pageSize: number;
  noticeId?: number;
  noticeTitle?: string;
  noticeType?: string;
  noticeContent?: string;
  status?: string;
  imgs?: string;
  createBy?: string;
  createdAt?: string;
  updateBy?: string;
  updatedAt?: string;
  remark?: string;
}

export interface InoticeQuerySerType {
  pageNum: number;
  pageSize: number;
  notice_title?: { [OpTypes.like]: string };
  create_by?: { [OpTypes.like]: string };
}

export interface Inotice {
  noticeTitle?: string;
  noticeType?: string;
  noticeContent?: string;
  status?: string;
}

export interface InoticeSer {
  notice_id?: number;
  notice_title?: string;
  notice_type?: string;
  notice_content?: string;
  imgs?: string;
  status?: string;
  create_by?: string;
  created_at?: string;
  update_by?: string;
  updated_at?: string;
  remark?: string;
}
