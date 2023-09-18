import { http } from '@/api';
import { IsuccessTypeAPI } from '@/type';
import { IcommonUploadFilesType, IcommonUploadImgType } from '@/type/common';

// 公用单张图片上传（富文本使用）
export const commonUploadImgAPI = (data: FormData) => http<IcommonUploadImgType>('POST', '/common/image', data);

// 公用删除图片
export const commonDelImgAPI = (ids: string[]) => http<IsuccessTypeAPI>('POST', '/common/delImage', ids);

// 公用多文件多图片上传
export const commonUploadFilesAPI = (data: FormData) => http<IcommonUploadFilesType>('POST', '/common/files', data);
