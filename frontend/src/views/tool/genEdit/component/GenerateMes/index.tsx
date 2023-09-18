import { Button, Col, Form, FormInstance, Input, Radio, Row, Select, TreeSelect } from 'antd';
import type { RadioChangeEvent } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import { menusType } from '@/type/modules/system/menu';
import { getListAPI } from '@/api/modules/system/menu';
import { ColumnType, GenType } from '@/type/modules/tool/gen';
import { generalTreeFn } from '@/utils/tree';
import { arePropsEqual } from '@/utils';
import classes from './index.module.scss';

export type BaseFormProps = {
  generateForm: FormInstance<any>;
  columns: ColumnType[];
  tableList: GenType[];
  currentTable: GenType;
};
const GenerateMes: React.FC<BaseFormProps> = (props) => {
  const { generateForm, columns, tableList, currentTable } = props;
  const [genType, setGenType] = useState('0');
  const [tplCategory, setTplCategory] = useState('crud');
  // 列表数据
  const [dataList, setDataList] = useState<menusType[]>([]);
  // 字段数据
  const [columnList, setColumnlist] = useState<ColumnType[]>([]);

  useEffect(() => {
    async function getInitData() {
      try {
        const { data } = await getListAPI({});
        const treeData = generalTreeFn(data.result, 'parentId', 'menuId') as unknown as menusType[];
        setDataList(treeData);
      } catch (error) {}
    }
    getInitData();
  }, []);

  useEffect(() => {
    if (currentTable) {
      generateForm.resetFields();
      generateForm.setFieldsValue({
        tplCategory: currentTable.tplCategory,
        packageName: currentTable.packageName,
        moduleName: currentTable.moduleName,
        functionAuthor: currentTable.functionAuthor,
        businessName: currentTable.businessName,
        functionName: currentTable.functionName,
        genType: currentTable.genType,
        parentId: currentTable.parentId,
        treeCode: currentTable.treeCode,
        treeParentCode: currentTable.treeParentCode,
        treeName: currentTable.treeName,
        subTableName: currentTable.subTableName,
        subTableFkName: currentTable.subTableFkName,
      });
      setGenType(currentTable.genType);
      setTplCategory(currentTable.tplCategory);
    }
  }, [currentTable]);

  const changeGenType = (event: RadioChangeEvent) => {
    setGenType(event.target.value);
  };

  const changeTplCategory = (value: string) => {
    setTplCategory(value);
  };

  const restorePath = () => {
    generateForm.setFieldValue('genPath', '/');
  };

  const handleTableNameChange = (value: string) => {
    const column = tableList.find((item) => item.tableName === value);
    setColumnlist(column?.columns as ColumnType[]);
  };

  return (
    <Form
      className={classes['generate-mes']}
      form={generateForm}
      labelCol={{ span: 6 }}
      initialValues={{
        tplCategory: 'crud',
        genType: '0',
        genPath: '/',
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="生成模板" name="tplCategory" rules={[{ required: true, message: '请输入生成模板!' }]}>
            <Select
              onChange={changeTplCategory}
              options={[
                {
                  value: 'crud',
                  label: '单表（增删改查）',
                },
                {
                  value: 'tree',
                  label: '树表（增删改查）',
                },
                {
                  value: 'sub',
                  label: '主子表（增删改查）',
                },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="生成包路径" name="packageName" rules={[{ required: true, message: '请输入生成包路径!' }]} tooltip="生成在src下的文件，例如 business.middleware.system">
            <Input placeholder="请输入生成包路径" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="生成模块名" name="moduleName" rules={[{ required: true, message: '请输入生成模块名!' }]} tooltip="可理解为子系统名，例如 system">
            <Input placeholder="请输入生成模块名" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="生成业务名" name="businessName" rules={[{ required: true, message: '请输入生成业务名!' }]} tooltip="可理解为功能英文名，例如 user">
            <Input placeholder="请输入生成业务名" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="生成功能名" name="functionName" rules={[{ required: true, message: '请输入生成功能名!' }]} tooltip="用作类描述，例如 用户">
            <Input placeholder="请输入生成功能名" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="上级菜单" name="parentId" tooltip="分配到指定菜单下(zip压缩包不支持)，例如 系统管理">
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              fieldNames={{ value: 'menuId', label: 'menuName' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择上级菜单"
              allowClear
              treeDefaultExpandedKeys={[0]}
              treeData={[
                {
                  menuId: 0,
                  menuName: '主类目',
                  children: dataList,
                },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="生成代码方式" name="genType" tooltip="批量生成只支持zip压缩包，自定义路径仅支持单个生成">
            <Radio.Group onChange={changeGenType}>
              <Radio value="0">zip压缩包</Radio>
              <Radio value="1">自定义路径</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={24} hidden={genType === '0'}>
          <Form.Item label="生成代码方式" name="genPath" labelCol={{ span: 3 }} tooltip="填写磁盘绝对路径，若不填写，则生成到当前Web项目下">
            <Input
              allowClear
              addonAfter={
                <Button type="ghost" onClick={restorePath}>
                  恢复默认的生成基础路径
                </Button>
              }
            />
          </Form.Item>
        </Col>

        <Col span={24} hidden={tplCategory !== 'tree'}>
          <h4>其他信息</h4>
          <Row>
            <Col span={12}>
              <Form.Item label="树编码字段" name="treeCode" tooltip="树显示的编码字段名， 如：dept_id">
                <Select
                  placeholder="请选择树编码字段"
                  options={columns.map((item) => ({
                    value: item.columnName,
                    label: `${item.columnName}：${item.columnComment}`,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="树父编码字段" name="treeParentCode" tooltip="树显示的父编码字段名， 如：parent_Id">
                <Select
                  placeholder="请选择树父编码字段"
                  options={columns.map((item) => ({
                    value: item.columnName,
                    label: `${item.columnName}：${item.columnComment}`,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="树名称字段" name="treeName" tooltip="树节点的显示名称字段名， 如：dept_name">
                <Select
                  placeholder="请选择树名称字段"
                  options={columns.map((item) => ({
                    value: item.columnName,
                    label: `${item.columnName}：${item.columnComment}` || null,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>

        <Col span={24} hidden={tplCategory !== 'sub'}>
          <h4>其他信息</h4>
          <Row>
            <Col span={12}>
              <Form.Item label="关联子表的表名" name="subTableName" tooltip="关联子表的表名， 如：sys_user">
                <Select
                  placeholder="请选择关联子表的表名"
                  onChange={handleTableNameChange}
                  options={tableList.map((item) => ({
                    value: item.tableName,
                    label: `${item.tableName}：${item.tableComment}`,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelCol={{ span: 7 }} label="子表关联的外键名" name="subTableFkName" tooltip="子表关联的外键名， 如：user_id">
                <Select
                  placeholder="请选择子表关联的外键名"
                  options={columnList.map((item) => ({
                    value: item.columnName,
                    label: `${item.columnName}：${item.columnComment}`,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default memo(GenerateMes, arePropsEqual);
