import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { commonUploadFilesAPI } from '@/api/modules/common';

export type imgsUploadProps = {
  limit?: number; // 上传数量限制
  fileSize?: number; // 大小限制(MB)
  fileType?: string; // 图片类型, 例如''png', 'jpg', 'jpeg''
};

const ImageUpload = (props: imgsUploadProps, ref: any) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { limit = 5, fileSize = 5, fileType = '.png,.jpg,.jpeg' } = props;

  // 确认上传
  const handleUploadOk = async () => {
    try {
      const fd = new FormData();
      fileList.forEach((file: any) => {
        fd.append('files', file.originFileObj);
      });
      const { data } = await commonUploadFilesAPI(fd);
      // 上传成功后将图片的唯一标识存储到数据库内，后续从数据库内获取图片url回显图片
    } catch (error) {}
  };

  // 取消
  const handleUploadCancel = () => {
    setFileList([]);
  };

  // ref 上传函数
  useImperativeHandle(ref, () => ({
    handleUploadOk,
    handleUploadCancel,
  }));

  // 图片更改
  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file: UploadFile) => {
    const isLt = (file.size as number) / 1024 / 1024 < fileSize;

    if (!isLt) {
      message.error(`${file.name} 文件大小超过 ${fileSize} MB`);
      return true;
    }
    return false;
  };

  // 图片预览
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  /// 图片删除
  const onRemove = (file: UploadFile) => {
    const newFileList = fileList.filter((item) => item.uid === file.uid);
    setFileList(newFileList);
  };

  return (
    <ImgCrop>
      <Upload
        action="https://errror"
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
        onRemove={onRemove}
        beforeUpload={beforeUpload}
        maxCount={limit}
        accept={fileType}
      >
        {fileList.length < limit && '+ Upload'}
      </Upload>
    </ImgCrop>
  );
};

export default forwardRef(ImageUpload);
