import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Col, Row, Tooltip, Table, Modal, Radio, TreeSelect, InputNumber, message } from 'antd';
import { SyncOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SwapOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getListAPI, delAPI, getDetailAPI, addAPI, putAPI } from '@/api/modules/system/dept';
import { getDictsApi } from '@/api/modules/system/dictData';
import { IdeptType, ITreeType } from '@/type/modules/system/dept';

import ColorBtn from '@/components/ColorBtn';
import { IdictType } from '@/type/modules/system/sysDictData';
import DictTag from '@/components/DictTag';
import { generalTreeFn } from '@/utils/tree';
import { hasPermi } from '@/utils/auth';

const SysDept: React.FC = () => {
  const [queryForm] = Form.useForm();
  const [addEditForm] = Form.useForm();
  const { confirm } = Modal;

  // 搜索
  const [queryParams, setQueryParams] = useState<IdeptType>({});
  // 列表数据
  const [dataList, setDataList] = useState<ITreeType[]>([]);
  // table loading
  const [loading, setLoading] = useState(true);
  // 新增编辑 model显隐
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 新增编辑判断
  const [isAdd, setIsAdd] = useState(true);
  // 控制搜索隐藏显示
  const [searchShow, setSearchShow] = useState(true);
  // 当前编辑的id
  const [currentId, setCurrentId] = useState<number>();
  //  行展开
  const [expandKeys, setExpandKeys] = useState<any>({});
  const [dictStatus, setDictStatus] = useState<IdictType[]>([]);

  useEffect(() => {
    const getDictsFn = async () => {
      try {
        const sys_normal_disable = await getDictsApi('sys_normal_disable');
        setDictStatus(sys_normal_disable.data.result);
      } catch (error) {}
    };
    getDictsFn();
  }, []);

  const checkExpandKeys = (data: ITreeType[]) => {
    setExpandKeys({ expandedRowKeys: [] });
    const ids: number[] = [];
    function checkChild(list: ITreeType[]) {
      list.forEach((item) => {
        if (item.children?.length) {
          ids.push(item.deptId as number);
          checkChild(item.children);
        }
      });
    }
    checkChild(data);
    setExpandKeys({ expandedRowKeys: ids });
  };

  // 查询列表
  const getList = async () => {
    try {
      const { data } = await getListAPI();

      data.result.rows.sort((a, b) => {
        const a1 = a.orderNum as number;
        const b1 = b.orderNum as number;
        return a1 - b1;
      });
      const treeData = generalTreeFn(data.result.rows, 'parentId', 'deptId') as ITreeType[];

      setDataList(treeData);
      checkExpandKeys(treeData);
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getList();
  }, [queryParams]);

  // 搜索
  const searchQueryFn = () => {
    const form = queryForm.getFieldsValue();
    setQueryParams({ ...form });
  };

  // 重置
  const resetQueryFn = () => {
    queryForm.resetFields();
    setQueryParams({});
  };

  // 获取详情
  const handleEditForm = async (id: number) => {
    try {
      const { data } = await getDetailAPI(id);
      setCurrentId(id);
      setIsModalOpen(true);
      setIsAdd(false);
      addEditForm.setFieldsValue(data.result as unknown as IdeptType);
    } catch (error) {}
  };

  // 编辑
  const handleFormFinish = async (values: IdeptType) => {
    try {
      if (isAdd) {
        const { data } = await addAPI(values);
        message.success(data.message);
      } else {
        const { data } = await putAPI({ ...values, deptId: currentId });
        message.success(data.message);
      }
    } catch (error) {}
    setIsModalOpen(false);
    addEditForm.resetFields();
    getList();
  };

  // 新增
  const handleAddForm = (record: IdeptType) => {
    setIsAdd(true);
    setIsModalOpen(true);
    addEditForm.setFieldValue('parentId', record.deptId);
  };

  // 删除
  const delFn = (ids: string) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除字典编号为"${ids}"的数据项？`,
      centered: true,
      onOk: async () => {
        try {
          const { data } = await delAPI(ids);
          message.success(data.message);
          getList();
        } catch (error) {}
      },
    });
  };

  // 行展开
  const expandFn = () => {
    if (expandKeys.expandedRowKeys && expandKeys.expandedRowKeys.length) {
      setExpandKeys({ expandedRowKeys: [] });
    } else {
      checkExpandKeys(dataList);
    }
  };

  // table
  const columns = [
    {
      title: '区域名称',
      dataIndex: 'deptName',
      key: 'deptName',
      align: 'center',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      key: 'orderNum',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value) => <DictTag options={dictStatus} value={value} />,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      render: (_: any, record: IdeptType) => (
        <div>
          <Button hidden={hasPermi('system:dept:edit')} onClick={() => handleEditForm(record.deptId as number)} size="small" icon={<EditOutlined />} type="link">
            修改
          </Button>
          <Button hidden={hasPermi('system:dept:add')} onClick={() => handleAddForm(record)} size="small" icon={<PlusOutlined />} type="link">
            新增
          </Button>
          <Button hidden={!record.parentId || hasPermi('system:dept:remove')} size="small" icon={<DeleteOutlined />} type="link" onClick={() => delFn(String(record.deptId))}>
            删除
          </Button>
        </div>
      ),
    },
  ] as ColumnsType<IdeptType>;

  // table 数据源
  const tableData = dataList;

  return (
    <div className="app-container">
      <Row gutter={16}>
        <Col span={24}>
          <Form form={queryForm} hidden={!searchShow} layout="inline" className="leno-search">
            <Form.Item label="区域名称" name="deptName">
              <Input style={{ width: 240 }} placeholder="请输入区域名称" allowClear onPressEnter={searchQueryFn} />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select
                style={{ width: 240 }}
                placeholder="区域状态"
                allowClear
                options={dictStatus.map((item) => ({
                  value: item.dictValue,
                  label: item.dictLabel,
                }))}
              />
            </Form.Item>

            <Form.Item>
              <Button onClick={searchQueryFn} type="primary" icon={<SearchOutlined />}>
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={resetQueryFn} icon={<SyncOutlined />}>
                重置
              </Button>
            </Form.Item>
          </Form>
          <Row gutter={16} className="mb10">
            <Col span={16} className="leno-btn">
              <Row gutter={8}>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('system:dept:add')}
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsAdd(true);
                    }}
                  >
                    新增
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn color="info" icon={<SwapOutlined rotate={90} />} onClick={expandFn}>
                    展开/折叠
                  </ColorBtn>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row gutter={8} justify="end">
                <Col>
                  <Tooltip placement="top" title={searchShow ? '隐藏搜索' : '显示搜索'}>
                    <Button
                      shape="circle"
                      icon={<SearchOutlined />}
                      onClick={() => {
                        setSearchShow(!searchShow);
                      }}
                    />
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip placement="top" title="刷新">
                    <Button
                      shape="circle"
                      icon={<SyncOutlined />}
                      onClick={() => {
                        searchQueryFn();
                      }}
                    />
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="leno-table">
            <Table columns={columns} dataSource={tableData} pagination={false} rowKey="deptId" size="middle" loading={loading} expandable={expandKeys} onExpand={() => setExpandKeys({})} />
          </div>

          {/* 添加 编辑 用户 */}
          <Modal
            title={isAdd ? '添加区域' : '编辑区域'}
            open={isModalOpen}
            onOk={() => addEditForm.submit()}
            onCancel={() => {
              setIsModalOpen(false);
              addEditForm.resetFields();
            }}
            width={600}
          >
            <Form
              form={addEditForm}
              labelCol={{ span: 7 }}
              onFinish={handleFormFinish}
              initialValues={{
                status: '0',
                orderNum: 0,
              }}
            >
              <Form.Item label="上级区域" name="parentId" rules={[{ required: true, message: '请选择上级区域!' }]} hidden={!isAdd} labelCol={{ span: 3.5 }}>
                <TreeSelect
                  showSearch
                  fieldNames={{ value: 'deptId', label: 'deptName' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择上级区域"
                  allowClear
                  treeDefaultExpandedKeys={[0]}
                  treeData={dataList}
                />
              </Form.Item>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="区域名称" name="deptName" hidden={false} rules={[{ required: true, message: '请输入区域名称!' }]}>
                    <Input placeholder="请输入区域名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="显示顺序" name="orderNum" hidden={false} rules={[{ required: true, message: '请输入显示顺序!' }]}>
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="负责人" name="leader" hidden={false}>
                    <Input placeholder="请输入负责人" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="联系电话" name="phone" hidden={false}>
                    <Input placeholder="请输入联系电话" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="邮箱" name="email" hidden={false}>
                    <Input placeholder="请输入邮箱" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="状态" name="status">
                    <Radio.Group
                      options={dictStatus.map((item) => ({
                        value: item.dictValue,
                        label: item.dictLabel,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Col>
      </Row>
    </div>
  );
};

export default SysDept;
