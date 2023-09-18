import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, DatePicker, Col, Row, Tooltip, Table, Pagination, Modal, Radio, message } from 'antd';
import { SyncOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getListAPI, delAPI, getDetailAPI, addAPI, putAPI } from '@/api/modules/system/config';
import { getDictsApi } from '@/api/modules/system/dictData';
import { download } from '@/api';
import { IconfigDetailType, IconfigType } from '@/type/modules/system/config';
import ColorBtn from '@/components/ColorBtn';
import { IdictType } from '@/type/modules/system/sysDictData';
import DictTag from '@/components/DictTag';
import dayjs from 'dayjs';
import { hasPermi } from '@/utils/auth';
import { pageDelJump } from '@/utils';

const { RangePicker } = DatePicker;

const SysConfig: React.FC = () => {
  const { TextArea } = Input;
  const [queryForm] = Form.useForm();
  const [addEditForm] = Form.useForm();
  const { confirm } = Modal;

  // 分页
  const [queryParams, setQueryParams] = useState<IconfigType>({ pageNum: 1, pageSize: 10 });
  // 列表数据
  const [dataList, setDataList] = useState({ count: 0, rows: [] as IconfigDetailType[] });
  // table loading
  const [loading, setLoading] = useState(true);
  // 新增编辑 model显隐
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 新增编辑判断
  const [isAdd, setIsAdd] = useState(true);
  // 非单个禁用
  const [single, setSingle] = useState(true);
  // 非多个禁用
  const [multiple, setMultiple] = useState(true);
  // 保存table 选择的key
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([]);
  //  table 后台使用的key
  const [rowKeys, setRowKeys] = useState('');
  // 控制搜索隐藏显示
  const [searchShow, setSearchShow] = useState(true);
  // 当前编辑的id
  const [currentId, setCurrentId] = useState<number>();

  const [dictConfigType, setDictConfigType] = useState<IdictType[]>([]);

  useEffect(() => {
    const getDictsFn = async () => {
      try {
        const sys_yes_no = await getDictsApi('sys_yes_no');
        setDictConfigType(sys_yes_no.data.result);
      } catch (error) {}
    };
    getDictsFn();
  }, []);

  // 查询列表
  const getList = async () => {
    try {
      const { data } = await getListAPI(queryParams);
      setDataList({ ...data.result });
      setLoading(false);
    } catch (error) {}
  };
  useEffect(() => {
    getList();
  }, [queryParams]);

  // 搜索
  const searchQueryFn = () => {
    // eslint-disable-next-line prefer-const
    let { createdAt, ...form } = queryForm.getFieldsValue();
    if (createdAt) {
      form = {
        ...form,
        createdAt: {
          beginTime: dayjs(createdAt[0]).format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(createdAt[1]).format('YYYY-MM-DD HH:mm:ss'),
        },
      };
    }
    setQueryParams({
      pageNum: 1,
      pageSize: 10,
      ...form,
    });
  };

  // 重置
  const resetQueryFn = () => {
    queryForm.resetFields();
    setSelectKeys([]);
    setQueryParams({ pageNum: 1, pageSize: 10 });
  };

  // row-select
  const rowSelection = {
    selectedRowKeys: selectKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      if (!selectedRowKeys.length || selectedRowKeys.length > 1) {
        setSingle(true);
      } else {
        setSingle(false);
      }
      selectedRowKeys.length ? setMultiple(false) : setMultiple(true);
      setSelectKeys(selectedRowKeys);
      setRowKeys(selectedRowKeys.join(','));
    },
  };

  // 获取详情
  const handleEditForm = async (id: number) => {
    try {
      const { data } = await getDetailAPI(id);
      setCurrentId(id);
      setIsModalOpen(true);
      setIsAdd(false);
      addEditForm.setFieldsValue(data.result as unknown as IconfigType);
    } catch (error) {}
  };

  // 表单提交
  const handleFormFinish = async (values: IconfigType) => {
    try {
      if (isAdd) {
        const { data } = await addAPI(values);
        message.success(data.message);
      } else {
        const { data } = await putAPI({ ...values, configId: currentId });
        message.success(data.message);
      }
    } catch (error) {}

    addEditForm.resetFields();
    getList();
    setIsModalOpen(false);
  };

  // 分页
  const onPagChange = async (pageNum: number, pageSize: number) => {
    setQueryParams({ pageNum, pageSize });
  };

  // 删除
  const delFn = (ids: string) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除编号为"${ids}"的数据项？`,
      centered: true,
      onOk: async () => {
        try {
          const { data } = await delAPI(ids);
          message.success(data.message);
          pageDelJump(dataList.count, ids, queryParams, setQueryParams);
        } catch (error) {}
      },
    });
  };

  // table
  const columns = [
    {
      title: '编码',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (text, record, index) => index + 1, // 渲染序号
    },
    {
      title: '参数名称',
      dataIndex: 'configName',
      key: 'configName',
      align: 'center',
      ellipsis: { showTitle: false },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: '参数键名',
      dataIndex: 'configKey',
      key: 'configKey',
      align: 'center',
      ellipsis: { showTitle: false },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: '参数键值',
      dataIndex: 'configValue',
      key: 'configValue',
      align: 'center',
    },
    {
      title: '系统内置',
      dataIndex: 'configType',
      key: 'configType',
      align: 'center',
      render: (value) => <DictTag options={dictConfigType} value={value} />,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
      ellipsis: { showTitle: false },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      width: 150,
      render: (_: any, record: IconfigType) => (
        <div>
          <Button hidden={hasPermi('system:config:edit')} onClick={() => handleEditForm(record.configId as number)} size="small" icon={<EditOutlined />} type="link">
            修改
          </Button>
          <Button hidden={hasPermi('system:config:remove')} size="small" icon={<DeleteOutlined />} type="link" onClick={() => delFn(String(record.configId))}>
            删除
          </Button>
        </div>
      ),
    },
  ] as ColumnsType<IconfigDetailType>;

  // table 数据源
  const tableData = dataList.rows;

  return (
    <div className="app-container">
      <Row gutter={16}>
        <Col span={24}>
          <Form form={queryForm} hidden={!searchShow} layout="inline" className="leno-search">
            <Form.Item label="参数名称" name="configName">
              <Input style={{ width: 240 }} placeholder="请输入参数名称" allowClear onPressEnter={searchQueryFn} />
            </Form.Item>
            <Form.Item label="参数键名" name="configKey">
              <Input style={{ width: 240 }} placeholder="请输入参数键名" allowClear onPressEnter={searchQueryFn} />
            </Form.Item>
            <Form.Item name="configType" label="系统内置">
              <Select
                style={{ width: 240 }}
                placeholder="系统内置"
                allowClear
                options={dictConfigType.map((item) => ({
                  value: item.dictValue,
                  label: item.dictLabel,
                }))}
              />
            </Form.Item>
            <Form.Item label="创建时间" name="createdAt">
              <RangePicker style={{ width: 240 }} />
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
                    hidden={hasPermi('system:config:add')}
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
                  <ColorBtn hidden={hasPermi('system:config:edit')} disabled={single} color="success" icon={<EditOutlined />} onClick={() => handleEditForm(Number(rowKeys))}>
                    修改
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn hidden={hasPermi('system:config:remove')} onClick={() => delFn(rowKeys)} disabled={multiple} color="danger" icon={<DeleteOutlined />}>
                    删除
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('system:config:export')}
                    color="warning"
                    icon={<VerticalAlignBottomOutlined />}
                    onClick={() => {
                      try {
                        download('/system/config/export');
                      } catch (error) {}
                    }}
                  >
                    导出
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
                        setSelectKeys([]);
                      }}
                    />
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="leno-table">
            <Table columns={columns} dataSource={tableData} pagination={false} rowKey="configId" size="middle" loading={loading} rowSelection={{ type: 'checkbox', fixed: 'left', ...rowSelection }} />
            <Pagination className="pagination" onChange={onPagChange} total={dataList.count} showSizeChanger showQuickJumper current={queryParams.pageNum} showTotal={(total) => `共 ${total} 条`} />
          </div>

          {/* 添加 编辑 用户 */}
          <Modal
            title={isAdd ? '添加参数设置' : '编辑参数设置'}
            open={isModalOpen}
            onOk={() => addEditForm.submit()}
            onCancel={() => {
              setIsModalOpen(false);
              addEditForm.resetFields();
            }}
          >
            <Form form={addEditForm} labelCol={{ span: 5 }} onFinish={handleFormFinish} initialValues={{ configType: 'Y' }}>
              <Form.Item label="参数名称" name="configName" hidden={false} rules={[{ required: true, message: '请输入参数名称!' }]}>
                <Input placeholder="请输入参数名称" />
              </Form.Item>
              <Form.Item label="参数键名" name="configKey" hidden={false} rules={[{ required: true, message: '请输入参数键名!' }]}>
                <Input placeholder="请输入参数键名" />
              </Form.Item>
              <Form.Item label="参数键值" name="configValue" hidden={false} rules={[{ required: true, message: '请输入参数键值!' }]}>
                <Input placeholder="请输入参数键值" />
              </Form.Item>
              <Form.Item label="系统内置" name="configType">
                <Radio.Group
                  options={dictConfigType.map((item) => ({
                    value: item.dictValue,
                    label: item.dictLabel,
                  }))}
                />
              </Form.Item>
              <Form.Item label="备注" name="remark" rules={[{ max: 200, message: '请输入内容(200字以内)!' }]}>
                <TextArea showCount placeholder="请输入内容(200字以内)" />
              </Form.Item>
            </Form>
          </Modal>
        </Col>
      </Row>
    </div>
  );
};

export default SysConfig;
