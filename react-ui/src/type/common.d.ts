// 公用单张图片上传（富文本使用）
export interface IcommonUploadImgType {
  code: number
  message: string
  result: { imgName: string }
}

// 公用多文件多图片上传
export interface IcommonUploadFilesType {
  code: number
  message: string
  result: string[]
}
