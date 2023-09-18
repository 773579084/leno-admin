import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Select, DatePicker, Col, Row, Tooltip, Table, Pagination, Modal, Radio, message } from 'antd';
import { SyncOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, VerticalAlignBottomOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getListAPI, delTypeAPI, getTypeAPI, addTypeAPI, putTypeAPI } from '@/api/modules/system/dictType';
import { getDictsApi } from '@/api/modules/system/dictData';
import { download } from '@/api';
import { ILimitAPI, dictTableType, IdictDataType } from '@/type';
import ColorBtn from '@/components/ColorBtn';
import dayjs from 'dayjs';
import { IdictType } from '@/type/modules/system/sysDictData';
import DictTag from '@/components/DictTag';
import { hasPermi } from '@/utils/auth';
import { pageDelJump } from '@/utils';

const { RangePicker } = DatePicker;

const DictType: React.FC = () => {
  const { TextArea } = Input;
  const [queryForm] = Form.useForm();
  const [addEditForm] = Form.useForm();
  const { confirm } = Modal;

  // 分页
  const [queryParams, setQueryParams] = useState<ILimitAPI>({ pageNum: 1, pageSize: 10 });
  // 列表数据
  const [dataList, setDataList] = useState({ count: 0, rows: [] as IdictDataType[] });
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
  // 控制搜索隐藏显示
  const [searchShow, setSearchShow] = useState(true);
  // 保存table 选择的key
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([]);
  //  table 后台使用的key
  const [rowKeys, setRowKeys] = useState('');
  // 当前编辑的id
  const [currentId, setCurrentId] = useState<number>();
  // 状态
  const [dictStatus, setDictStatus] = useState<IdictType[]>([]);

  useEffect(() => {
    const getDictsFn = async () => {
      try {
        const res = await getDictsApi('sys_normal_disable');
        setDictStatus(res.data.result);
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
        beginTime: dayjs(createdAt[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: dayjs(createdAt[1]).format('YYYY-MM-DD HH:mm:ss'),
      };
    }
    setQueryParams({
      pageNum: 1,
      pageSize: 10,
      ...form,
    });
  };

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
      setSelectKeys(selectedRowKeys);
      selectedRowKeys.length ? setMultiple(false) : setMultiple(true);
      setRowKeys(selectedRowKeys.join(','));
    },
  };

  const handleEditForm = async (id: number) => {
    const { data } = await getTypeAPI(id);
    addEditForm.setFieldsValue(data.result as unknown as IdictType);
    setCurrentId(id);
    setIsModalOpen(true);
    setIsAdd(false);
  };

  const handleFormFinish = async (values: IdictDataType) => {
    try {
      if (isAdd) {
        const { data } = await addTypeAPI(values);
        message.success(data.message);
      } else {
        const { data } = await putTypeAPI({ ...values, dictId: currentId });
        message.success(data.message);
      }
      addEditForm.resetFields();
      getList();
      setIsModalOpen(false);
    } catch (error) {}
  };

  // #region table
  // 分页
  const onPagChange = async (pageNum: number, pageSize: number) => {
    setQueryParams({ pageNum, pageSize });
  };

  // 删除
  const delFn = (ids: string) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除字典编号为"${ids}"的数据项？`,
      centered: true,
      onOk: async () => {
        try {
          const { data } = await delTypeAPI(ids);
          message.success(data.message);
          pageDelJump(dataList.count, ids, queryParams, setQueryParams);
        } catch (error) {}
      },
    });
  };

  // table columns
  const columns = [
    {
      title: '字典编码',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (text, record, index) => index + 1, // 渲染序号
    },
    {
      title: '字典名称',
      dataIndex: 'dictName',
      key: 'dictName',
      align: 'center',
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      key: 'dictType',
      align: 'center',
      render: (dictType: string) => (
        <div style={{ color: '#337cbe', cursor: 'pointer' }}>
          <Link to={`/system/dictData/${dictType}`}>{dictType}</Link>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => <DictTag options={dictStatus} value={status} />,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: '180px',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      render: (_: any, record: IdictDataType) => (
        <div>
          <Button hidden={hasPermi('system:dict:edit')} onClick={() => handleEditForm(record.dictId as number)} size="small" icon={<EditOutlined />} type="link">
            修改
          </Button>
          <Button hidden={hasPermi('system:dict:remove')} size="small" icon={<DeleteOutlined />} type="link" onClick={() => delFn(`${record.dictId}`)}>
            删除
          </Button>
        </div>
      ),
    },
  ] as ColumnsType<dictTableType>;

  // table 数据源
  const tableData = dataList.rows;
  // #endregion

  return (
    <div className="app-container">
      <Row gutter={16}>
        <Col span={24}>
          <Form form={queryForm} hidden={!searchShow} layout="inline" className="leno-search">
            <Form.Item label="字典名称" name="dictName">
              <Input style={{ width: 240 }} placeholder="请输入字典名称" allowClear onPressEnter={searchQueryFn} />
            </Form.Item>
            <Form.Item label="字典类型" name="dictType">
              <Input style={{ width: 240 }} placeholder="请输入字典类型" allowClear onPressEnter={searchQueryFn} />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select
                style={{ width: 240 }}
                placeholder="字典状态"
                allowClear
                options={dictStatus.map((item) => ({
                  value: item.dictValue,
                  label: item.dictLabel,
                }))}
              ></Select>
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
                    hidden={hasPermi('system:dict:add')}
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
                  <ColorBtn hidden={hasPermi('system:dict:edit')} disabled={single} color="success" icon={<EditOutlined />} onClick={() => handleEditForm(Number(rowKeys))}>
                    修改
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn hidden={hasPermi('system:dict:remove')} onClick={() => delFn(rowKeys)} disabled={multiple} color="danger" icon={<DeleteOutlined />}>
                    删除
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('system:dict:export')}
                    color="warning"
                    icon={<VerticalAlignBottomOutlined />}
                    onClick={() => {
                      try {
                        download('/system/dictType/export');
                      } catch (error) {}
                    }}
                  >
                    导出
                  </ColorBtn>
                </Col>
                {/* <Col>
                  <ColorBtn color="danger" icon={<SyncOutlined />}>
                    刷新缓存
                  </ColorBtn>
                </Col> */}
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
            <Table
              rowSelection={{ type: 'checkbox', fixed: 'left', ...rowSelection }}
              columns={columns}
              dataSource={tableData as unknown as dictTableType[]}
              pagination={false}
              rowKey="dictId"
              size="middle"
              loading={loading}
            />
            <Pagination className="pagination" onChange={onPagChange} total={dataList.count} showSizeChanger showQuickJumper current={queryParams.pageNum} showTotal={(total) => `共 ${total} 条`} />
          </div>

          {/* 添加 编辑 用户 */}
          <Modal
            title={isAdd ? '添加字典类型' : '编辑字典类型'}
            open={isModalOpen}
            onOk={() => addEditForm.submit()}
            onCancel={() => {
              setIsModalOpen(false);
              addEditForm.resetFields();
            }}
            forceRender
          >
            <Form form={addEditForm} labelCol={{ span: 6 }} initialValues={{ status: '0' }} onFinish={handleFormFinish}>
              <Form.Item label="字典名称" name="dictName" rules={[{ required: true, message: '请输入字典名称!' }]}>
                <Input placeholder="请输入字典名称" />
              </Form.Item>

              <Form.Item label="字典类型" name="dictType" rules={[{ required: true, message: '请输入字典类型!' }]}>
                <Input placeholder="请输入字典类型" />
              </Form.Item>

              <Form.Item label="状态" name="status">
                <Radio.Group
                  options={dictStatus.map((item) => ({
                    value: item.dictValue,
                    label: item.dictLabel,
                  }))}
                />
              </Form.Item>
              <Form.Item label="备注" name="remark" rules={[{ max: 200, message: '请输入内容(200字以内)!' }]}>
                <TextArea showCount placeholder="请输入内容(200字以内)" rows={3} />
              </Form.Item>
            </Form>
          </Modal>
        </Col>
      </Row>
    </div>
  );
};

export default DictType;
