import React, { memo, useEffect } from 'react';
import { Form, Input, Col, Row, FormInstance } from 'antd';
import { GenType } from '@/type/modules/tool/gen';
import { arePropsEqual } from '@/utils';

export type BaseFormProps = {
  baseForm: FormInstance<any>;
  currentTable: GenType;
};
const BaseMes: React.FC<BaseFormProps> = (props) => {
  const { baseForm, currentTable } = props;
  const { TextArea } = Input;

  useEffect(() => {
    if (currentTable) {
      baseForm.resetFields();
      baseForm.setFieldsValue({
        tableName: currentTable.tableName,
        tableComment: currentTable.tableComment,
        className: currentTable.className,
        functionAuthor: currentTable.functionAuthor,
        remark: currentTable.remark,
      });
    }
  }, [currentTable]);

  return (
    <Form form={baseForm} labelCol={{ span: 6 }} initialValues={currentTable}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="表名称" name="tableName" rules={[{ required: true, message: '请输入表名称!' }]}>
            <Input placeholder="请输入表名称" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="表描述" name="tableComment" rules={[{ required: true, message: '请输入表描述!' }]}>
            <Input placeholder="请输入表描述" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="实体类名称" name="className" rules={[{ required: true, message: '请输入实体类名称!' }]}>
            <Input placeholder="请输入实体类名称" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="作者" name="functionAuthor" rules={[{ required: true, message: '请输入作者!' }]}>
            <Input placeholder="请输入作者" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item labelCol={{ span: 3 }} label="备注" name="remark" rules={[{ max: 200, message: '请输入内容(200字以内)!' }]}>
        <TextArea showCount placeholder="请输入内容(200字以内)" rows={3} />
      </Form.Item>
    </Form>
  );
};
export default memo(BaseMes, arePropsEqual);
