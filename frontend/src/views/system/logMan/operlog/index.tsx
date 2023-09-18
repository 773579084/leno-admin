import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, DatePicker, Col, Row, Tooltip, Table, Pagination, Modal, message } from 'antd';
import { SyncOutlined, SearchOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getListAPI, delAPI, getDetailAPI, cleanAPI } from '@/api/modules/system/operlog';
import { getDictsApi } from '@/api/modules/system/dictData';
import { download } from '@/api';
import { IoperlogDetailType, IoperlogType } from '@/type/modules/system/operlog';
import ColorBtn from '@/components/ColorBtn';
import { IdictType } from '@/type/modules/system/sysDictData';
import DictTag from '@/components/DictTag';
import dayjs from 'dayjs';
import { hasPermi } from '@/utils/auth';
import { pageDelJump } from '@/utils';

const { RangePicker } = DatePicker;

const SysOperLog: React.FC = () => {
  const [queryForm] = Form.useForm();
  const { confirm } = Modal;

  // 分页
  const [queryParams, setQueryParams] = useState<IoperlogType>({ pageNum: 1, pageSize: 10 });
  // 列表数据
  const [dataList, setDataList] = useState({ count: 0, rows: [] as IoperlogType[] });
  // table loading
  const [loading, setLoading] = useState(true);
  // 新增编辑 model显隐
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 非多个禁用
  const [multiple, setMultiple] = useState(true);
  // 保存table 选择的key
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([]);
  //  table 后台使用的key
  const [rowKeys, setRowKeys] = useState('');
  // 控制搜索隐藏显示
  const [searchShow, setSearchShow] = useState(true);
  // 详情数据
  const [detailData, setDetailData] = useState<IoperlogDetailType>({});

  const [dictBusinessType, setDictBusinessType] = useState<IdictType[]>([]);
  const [dictStatus, setDictStatus] = useState<IdictType[]>([]);

  useEffect(() => {
    const getDictsFn = async () => {
      try {
        const sys_oper_type = await getDictsApi('sys_oper_type');
        setDictBusinessType(sys_oper_type.data.result);
        const sys_common_status = await getDictsApi('sys_common_status');
        setDictStatus(sys_common_status.data.result);
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
    let { operTime, ...form } = queryForm.getFieldsValue();
    if (operTime) {
      form = {
        ...form,
        operTime: {
          beginTime: dayjs(operTime[0]).format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(operTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        },
      };
    }
    setQueryParams({
      pageNum: 1,
      pageSize: 10,
      ...form,
    });
  };

  // 类型转换
  const dictToggle = (dictValue: string, dict: IdictType[]) => dict.find((item) => item.dictValue === dictValue)?.dictLabel;

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
      selectedRowKeys.length ? setMultiple(false) : setMultiple(true);
      setSelectKeys(selectedRowKeys);
      setRowKeys(selectedRowKeys.join(','));
    },
  };

  // 获取详情
  const handleEditForm = async (id: number) => {
    try {
      const { data } = await getDetailAPI(id);
      setDetailData(data.result);
      setIsModalOpen(true);
    } catch (error) {}
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

  // 清空操作日志
  const delAllFn = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `是否确认清空所有操作日志数据项？`,
      centered: true,
      onOk: async () => {
        try {
          const { data } = await cleanAPI();
          message.success(data.message);
          getList();
        } catch (error) {}
      },
    });
  };

  // table
  const columns = [
    {
      title: '日志主键',
      dataIndex: 'operId',
      key: 'operId',
      align: 'center',
    },
    {
      title: '系统模块',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      ellipsis: { showTitle: false },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: '操作类型',
      dataIndex: 'businessType',
      key: 'businessType',
      align: 'center',
      render: (value) => <DictTag options={dictBusinessType} value={value} />,
    },
    {
      title: '操作人员',
      dataIndex: 'operName',
      key: 'operName',
      align: 'center',
    },
    {
      title: '主机地址',
      dataIndex: 'operIp',
      key: 'operIp',
      align: 'center',
    },
    {
      title: '操作地点',
      dataIndex: 'operLocation',
      key: 'operLocation',
      align: 'center',
      ellipsis: { showTitle: false },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: '操作状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value) => <DictTag options={dictStatus} value={value} />,
    },
    {
      title: '操作日期',
      dataIndex: 'operTime',
      key: 'operTime',
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
      render: (_: any, record: IoperlogType) => (
        <div>
          <Button onClick={() => handleEditForm(record.operId as number)} size="small" icon={<EditOutlined />} type="link">
            详情
          </Button>
        </div>
      ),
    },
  ] as ColumnsType<IoperlogType>;

  // table 数据源
  const tableData = dataList.rows;

  return (
    <div className="app-container">
      <Row gutter={16}>
        <Col span={24}>
          <Form form={queryForm} hidden={!searchShow} layout="inline" className="leno-search">
            <Form.Item label="系统模块" name="title">
              <Input style={{ width: 240 }} placeholder="请输入系统模块" allowClear onPressEnter={searchQueryFn} />
            </Form.Item>
            <Form.Item label="操作人员" name="operName">
              <Input style={{ width: 240 }} placeholder="请输入操作人员" allowClear onPressEnter={searchQueryFn} />
            </Form.Item>
            <Form.Item name="businessType" label="类型">
              <Select
                style={{ width: 240 }}
                placeholder="类型"
                allowClear
                options={dictBusinessType.map((item) => ({
                  value: item.dictValue,
                  label: item.dictLabel,
                }))}
              />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select
                style={{ width: 240 }}
                placeholder="状态"
                allowClear
                options={dictStatus.map((item) => ({
                  value: item.dictValue,
                  label: item.dictLabel,
                }))}
              />
            </Form.Item>
            <Form.Item label="操作时间" name="operTime">
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
                  <ColorBtn hidden={hasPermi('monitor:operlog:remove')} onClick={() => delFn(rowKeys)} disabled={multiple} color="danger" icon={<DeleteOutlined />}>
                    删除
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn hidden={hasPermi('monitor:operlog:remove')} onClick={delAllFn} color="danger" icon={<DeleteOutlined />}>
                    清空
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('monitor:operlog:export')}
                    color="warning"
                    icon={<VerticalAlignBottomOutlined />}
                    onClick={() => {
                      try {
                        download('/system/operlog/export');
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
            <Table columns={columns} dataSource={tableData} pagination={false} rowKey="operId" size="middle" loading={loading} rowSelection={{ type: 'checkbox', fixed: 'left', ...rowSelection }} />
            <Pagination className="pagination" onChange={onPagChange} total={dataList.count} showSizeChanger showQuickJumper current={queryParams.pageNum} showTotal={(total) => `共 ${total} 条`} />
          </div>

          <Modal
            title={'操作日志详情'}
            open={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false);
            }}
            width={700}
            footer={[
              <Button
                key="back"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                关闭
              </Button>,
            ]}
          >
            <Form labelCol={{ span: 3 }}>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="系统模块" labelCol={{ span: 6 }}>
                    {detailData.title}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item labelCol={{ span: 6 }} label="请求地址">
                    {detailData.operUrl}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="登录信息" labelCol={{ span: 6 }}>
                    {detailData.operName} /&nbsp;
                    {detailData.operIp}
                    &nbsp;/&nbsp;{detailData.operLocation}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item labelCol={{ span: 6 }} label="请求方式">
                    {detailData.requestMethod}
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="请求参数">{detailData.operParam}</Form.Item>
              <Form.Item label="返回参数">{detailData.jsonResult}</Form.Item>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item labelCol={{ span: 6 }} label="操作状态">
                    {dictToggle(detailData.status as string, dictStatus)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item labelCol={{ span: 6 }} label="操作时间">
                    {detailData.operTime}
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item hidden={!detailData.errorMsg} label="异常信息">
                {detailData.errorMsg}
              </Form.Item>
            </Form>
          </Modal>
        </Col>
      </Row>
    </div>
  );
};

export default SysOperLog;
