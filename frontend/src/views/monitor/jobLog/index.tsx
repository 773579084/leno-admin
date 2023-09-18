import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Col, Row, Tooltip, Table, Pagination, Modal, message, DatePicker } from 'antd';
import { SyncOutlined, SearchOutlined, DeleteOutlined, ExclamationCircleOutlined, VerticalAlignBottomOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getListAPI, delAPI, cleanAPI } from '@/api/modules/monitor/jobLog';
import { getDictsApi } from '@/api/modules/system/dictData';
import { download } from '@/api';
import { IjobLogType } from '@/type/modules/monitor/jobLog';

import ColorBtn from '@/components/ColorBtn';
import { hasPermi } from '@/utils/auth';
import { IdictType } from '@/type/modules/system/sysDictData';
import DictTag from '@/components/DictTag';
import dayjs from 'dayjs';
import { toJS } from 'mobx';
import { tbasType } from '@/type/modules/Layout';
import useStore from '@/store';
import { useParams, useNavigate } from 'react-router-dom';
import { getDetailAPI } from '@/api/modules/monitor/job';

const { RangePicker } = DatePicker;

const MonitorJobLog = () => {
  const [queryForm] = Form.useForm();
  const { confirm } = Modal;
  const navigate = useNavigate();
  const {
    useLayoutStore: { defaultObjMobx, changeTabsListMobx },
  } = useStore();
  const { jobId } = useParams();

  // 分页
  const [queryParams, setQueryParams] = useState<IjobLogType>({ pageNum: 1, pageSize: 10 });
  // 列表数据

  const [dataList, setDataList] = useState({ count: 0, rows: [] as IjobLogType[] });
  // table loading
  const [loading, setLoading] = useState(true);
  // 非多个禁用
  const [multiple, setMultiple] = useState(true);
  // 保存table 选择的key
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([]);
  //  table 后台使用的key
  const [rowKeys, setRowKeys] = useState('');
  // 控制搜索隐藏显示
  const [searchShow, setSearchShow] = useState(true);

  const [dictJobGroup, setDictJobGroup] = useState<IdictType[]>([]);
  const [dictStatus, setDictStatus] = useState<IdictType[]>([]);

  useEffect(() => {
    try {
      const getDictsFn = async () => {
        if (jobId !== '0') {
          // 请求job的数据
          const {
            data: { result },
          } = await getDetailAPI(Number(jobId));
          const obj = { jobName: result.jobName, jobGroup: result.jobGroup };
          setQueryParams({
            pageNum: 1,
            pageSize: 10,
            ...obj,
          });
          queryForm.setFieldsValue(obj);
        }

        const sys_job_group = await getDictsApi('sys_job_group');
        setDictJobGroup(sys_job_group.data.result);
        const sys_job_status = await getDictsApi('sys_job_status');
        setDictStatus(sys_job_status.data.result);
      };
      getDictsFn();
    } catch (error) {}
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
      selectedRowKeys.length ? setMultiple(false) : setMultiple(true);
      setSelectKeys(selectedRowKeys);
      setRowKeys(selectedRowKeys.join(','));
    },
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
          await delAPI(ids);
          message.success('删除成功');
          getList();
        } catch (error) {}
      },
    });
  };

  // 清空操作日志
  const delAllFn = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `是否确认清空所有登录日志数据项？`,
      centered: true,
      onOk: async () => {
        try {
          await cleanAPI();
          getList();
        } catch (error) {}
      },
    });
  };

  // 关闭当前页面
  const closePage = () => {
    const tabs = toJS(defaultObjMobx.tabsListMobx) as tbasType[];
    changeTabsListMobx(tabs.filter((tab) => tab.path.indexOf('/monitor/jobLog/') === -1));
    navigate('/monitor/job');
  };

  // table
  const columns = [
    {
      title: '日志编码',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (text, record, index) => index + 1, // 渲染序号
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      key: 'jobName',
      align: 'center',
    },
    {
      title: '任务组名',
      dataIndex: 'jobGroup',
      key: 'jobGroup',
      align: 'center',
      render: (value) => <DictTag options={dictJobGroup} value={value} />,
    },
    {
      title: '调用目标字符串',
      dataIndex: 'invokeTarget',
      key: 'invokeTarget',
      align: 'center',
    },
    {
      title: '日志信息',
      dataIndex: 'jobMessage',
      key: 'jobMessage',
      align: 'center',
    },
    {
      title: '执行状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value) => <DictTag options={dictStatus} value={value} />,
    },
    {
      title: '执行时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      render: (_: any, record: IjobLogType) => (
        <div>
          <Button hidden={hasPermi('monitor:jobLog:remove')} size="small" icon={<DeleteOutlined />} type="link" onClick={() => delFn(String(record.jobLogId))}>
            删除
          </Button>
        </div>
      ),
    },
  ] as ColumnsType<IjobLogType>;

  // table 数据源
  const tableData = dataList.rows;

  return (
    <div className="app-container">
      <Row gutter={16}>
        <Col span={24}>
          <Form form={queryForm} hidden={!searchShow} layout="inline" className="leno-search">
            <Form.Item label="任务名称" name="jobName">
              <Input style={{ width: 240 }} placeholder="请输入任务名称" allowClear onPressEnter={searchQueryFn} />
            </Form.Item>
            <Form.Item name="jobGroup" label="任务组名">
              <Select
                style={{ width: 240 }}
                placeholder="请选择任务组名"
                allowClear
                options={dictJobGroup.map((item) => ({
                  value: item.dictValue,
                  label: item.dictLabel,
                }))}
              />
            </Form.Item>
            <Form.Item name="status" label="执行状态">
              <Select
                style={{ width: 240 }}
                placeholder="请选择执行状态"
                allowClear
                options={dictStatus.map((item) => ({
                  value: item.dictValue,
                  label: item.dictLabel,
                }))}
              />
            </Form.Item>
            <Form.Item label="操作时间" name="createdAt">
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
                  <ColorBtn hidden={hasPermi('monitor:jobLog:remove')} onClick={() => delFn(rowKeys)} disabled={multiple} color="danger" icon={<DeleteOutlined />}>
                    删除
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn hidden={hasPermi('monitor:jobLog:remove')} onClick={delAllFn} color="danger" icon={<DeleteOutlined />}>
                    清空
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn hidden={hasPermi('monitor:jobLog:export')} color="warning" icon={<VerticalAlignBottomOutlined />} onClick={() => download('/monitor/jobLog/export', 'sys_dict_type')}>
                    导出
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn color="warning" icon={<CloseOutlined />} onClick={() => closePage()}>
                    关闭
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
            <Table columns={columns} dataSource={tableData} pagination={false} rowKey="jobLogId" size="middle" loading={loading} rowSelection={{ type: 'checkbox', fixed: 'left', ...rowSelection }} />
            <Pagination className="pagination" onChange={onPagChange} total={dataList.count} showSizeChanger showQuickJumper current={queryParams.pageNum} showTotal={(total) => `共 ${total} 条`} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MonitorJobLog;
