import { useState, forwardRef, useImperativeHandle } from 'react';
import { message, Upload, UploadFile } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { commonUploadFilesAPI } from '@/api/modules/common';

const { Dragger } = Upload;

export type filesUploadProps = {
  limit?: number; // 上传数量限制
  fileSize?: number; // 大小限制(MB)
  fileType?: string; // 文件类型, 例如'.xlsx,.ppt,.txt,.pdf'
};

const FileUpload = (props: filesUploadProps, ref: any) => {
  // 存储已上传的文件
  const [isFiles, setIsFiles] = useState<UploadFile<any>[]>([]);

  const { limit = 5, fileSize = 5, fileType = '.xlsx,.xls,.doc,.ppt,.txt,.pdf' } = props;

  const configuration: UploadProps = {
    action: 'https://errror',
    name: 'file',
    multiple: true,
    accept: fileType,
    fileList: isFiles,
    maxCount: limit,
    beforeUpload: (file) => {
      const isLt = file.size / 1024 / 1024 < fileSize;

      if (!isLt) {
        message.error(`${file.name} 文件大小超过 ${fileSize} MB`);
        return true;
      }
      return false;
    },
    onChange: (info) => {
      setIsFiles(info.fileList);
    },
  };

  // 确认上传
  const handleUploadOk = async () => {
    try {
      const fd = new FormData();
      isFiles.forEach((file: any) => {
        fd.append('files', file.originFileObj);
      });
      const { data } = await commonUploadFilesAPI(fd);

      setIsFiles([]);
    } catch (error) {}
  };
  // 取消
  const handleUploadCancel = () => {
    setIsFiles([]);
  };
  // ref 上传函数
  useImperativeHandle(ref, () => ({
    handleUploadOk,
    handleUploadCancel,
  }));

  return (
    <Dragger {...configuration} height={200}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
    </Dragger>
  );
};

export default forwardRef(FileUpload);
