import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Input, Select, Col, Row, Tooltip, Table, Pagination, Modal, Radio, message, Switch, Dropdown, MenuProps } from 'antd';
import {
  SyncOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  VerticalAlignBottomOutlined,
  BarsOutlined,
  DoubleRightOutlined,
  CaretRightOutlined,
  EyeOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getListAPI, delAPI, getDetailAPI, addAPI, putAPI, putStatusAPI, runOneAPI } from '@/api/modules/monitor/job';
import { getDictsApi } from '@/api/modules/system/dictData';
import { download } from '@/api';
import { IcronComeType, IjobDetailType, IjobType } from '@/type/modules/monitor/job';
import ColorBtn from '@/components/ColorBtn';
import { hasPermi } from '@/utils/auth';
import { IdictType } from '@/type/modules/system/sysDictData';
import DictTag from '@/components/DictTag';
import { useNavigate } from 'react-router-dom';
import Cron from '@/components/Cron';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MenuInfo } from 'rc-menu/lib/interface';
import { pageDelJump } from '@/utils';
import classes from './index.module.scss';

// 执行策略
const misfirePolicyDict = [
  {
    label: '立即执行',
    value: '1',
  },
  {
    label: '执行一次',
    value: '2',
  },
  {
    label: '放弃执行',
    value: '3',
  },
];
// 是否并发
const concurrentDict = [
  {
    label: '允许',
    value: '0',
  },
  {
    label: '禁止',
    value: '1',
  },
];

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <div>
        <CaretRightOutlined style={{ marginRight: 10 }} />
        执行一次
      </div>
    ),
  },
  {
    key: '2',
    label: (
      <div>
        <EyeOutlined style={{ marginRight: 10 }} />
        任务详细
      </div>
    ),
  },
  {
    key: '3',
    label: (
      <div>
        <BarsOutlined style={{ marginRight: 10 }} />
        调度日志
      </div>
    ),
  },
];

const MonitorJob = () => {
  const [queryForm] = Form.useForm();
  const [addEditForm] = Form.useForm();
  const { confirm } = Modal;
  const navigate = useNavigate();
  const cronRef = useRef();

  // 分页
  const [queryParams, setQueryParams] = useState<IjobType>({ pageNum: 1, pageSize: 10 });
  // 列表数据

  const [dataList, setDataList] = useState({ count: 0, rows: [] as IjobDetailType[] });
  // table loading
  const [loading, setLoading] = useState(true);
  // 新增编辑 model显隐
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  // 任务详情 model显隐
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
  // 存储当前的详细信息
  const [currentDetail, setCurrentDetail] = useState<IjobDetailType>({});
  // Cron model显隐
  const [isCronOpen, setIsCronOpen] = useState(false);

  const [dictJobGroup, setDictJobGroup] = useState<IdictType[]>([]);
  const [dictStatus, setDictStatus] = useState<IdictType[]>([]);

  useEffect(() => {
    const getDictsFn = async () => {
      try {
        const sys_job_group = await getDictsApi('sys_job_group');
        setDictJobGroup(sys_job_group.data.result);
        const sys_job_status = await getDictsApi('sys_job_status');
        setDictStatus(sys_job_status.data.result);
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
    const form = queryForm.getFieldsValue();
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
    onChange: (selectedRowKeys: React.Key[], selectedRows: IjobDetailType[]) => {
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
      setCurrentDetail(data.result);
      setIsModalOpen(true);
      setIsAdd(false);
      addEditForm.setFieldsValue(data.result as unknown as IjobType);
    } catch (error) {}
  };

  // 表单提交
  const handleFormFinish = async (values: IjobDetailType) => {
    try {
      if (isAdd) {
        const { data } = await addAPI(values);
        message.success(data.message);
      } else {
        const { data } = await putAPI({ ...values, jobId: currentId });
        message.success(data.message);
      }
    } catch (error) {}
    setIsModalOpen(false);
    addEditForm.resetFields();
    getList();
  };

  // cron 确认/重置
  const confirmResetCron = (type = 'add') => {
    const { refGetCron, resetCronState } = cronRef.current as unknown as IcronComeType;
    if (type === 'add') {
      addEditForm.setFieldValue('cronExpression', refGetCron());
    } else {
      resetCronState();
    }
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

  // 跳转 调度日志
  const jumpJobLog = (id = 0) => {
    console.log(245, id);
    navigate(`/monitor/jobLog/${id}`);
  };

  const handleMenuClick = async (e: MenuInfo, record: IjobType) => {
    switch (e.key) {
      case '1':
        try {
          const { data } = await runOneAPI({ jobId: record.jobId });
          message.success(data.message);
        } catch (error) {}
        break;
      case '2':
        try {
          const { data } = await getDetailAPI(record.jobId as number);
          setCurrentDetail(data.result);
          setIsTaskOpen(true);
        } catch (error) {}
        break;
      case '3':
        jumpJobLog(record.jobId);
        break;

      default:
        break;
    }
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
      title: 'cron执行表达式',
      dataIndex: 'cronExpression',
      key: 'cronExpression',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_: any, record: IjobType) => (
        <div>
          <Switch
            checked={record.status === '0'}
            onChange={async () => {
              try {
                await putStatusAPI({
                  jobId: record.jobId,
                  status: record.status === '0' ? '1' : '0',
                });
                getList();
              } catch (error) {}
            }}
          />
        </div>
      ),
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      render: (_: any, record: IjobType) => (
        <div>
          <Button hidden={hasPermi('monitor:job:edit')} onClick={() => handleEditForm(record.jobId as number)} size="small" icon={<EditOutlined />} type="link">
            修改
          </Button>
          <Button hidden={hasPermi('monitor:job:remove')} size="small" icon={<DeleteOutlined />} type="link" onClick={() => delFn(String(record.jobId))}>
            删除
          </Button>
          <Dropdown
            menu={{
              items,
              onClick: (e) => {
                handleMenuClick(e, record);
              },
            }}
            placement="bottomRight"
          >
            <Button size="small" icon={<DoubleRightOutlined />} type="link">
              更多
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ] as ColumnsType<IjobDetailType>;

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
                placeholder="任务组名"
                allowClear
                options={dictJobGroup.map((item) => ({
                  value: item.dictValue,
                  label: item.dictLabel,
                }))}
              />
            </Form.Item>
            <Form.Item name="status" label="任务状态">
              <Select
                style={{ width: 240 }}
                placeholder="任务状态"
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
                    hidden={hasPermi('monitor:job:add')}
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setCurrentDetail({});
                      setIsModalOpen(true);
                      setIsAdd(true);
                    }}
                  >
                    新增
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn hidden={hasPermi('monitor:job:edit')} disabled={single} color="success" icon={<EditOutlined />} onClick={() => handleEditForm(Number(rowKeys))}>
                    修改
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn hidden={hasPermi('monitor:job:remove')} onClick={() => delFn(rowKeys)} disabled={multiple} color="danger" icon={<DeleteOutlined />}>
                    删除
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn hidden={hasPermi('monitor:job:export')} color="warning" icon={<VerticalAlignBottomOutlined />} onClick={() => download('/monitor/job/export')}>
                    导出
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn color="info" icon={<BarsOutlined />} onClick={() => jumpJobLog()}>
                    日志
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
            <Table columns={columns} dataSource={tableData} pagination={false} rowKey="jobId" size="middle" loading={loading} rowSelection={{ type: 'checkbox', fixed: 'left', ...rowSelection }} />
            <Pagination className="pagination" onChange={onPagChange} total={dataList.count} showSizeChanger showQuickJumper current={queryParams.pageNum} showTotal={(total) => `共 ${total} 条`} />
          </div>

          {/* 添加 编辑  */}
          <Modal
            title={isAdd ? '添加任务' : '编辑任务'}
            open={isModalOpen}
            onOk={() => addEditForm.submit()}
            onCancel={() => {
              setIsModalOpen(false);
              addEditForm.resetFields();
            }}
            width={800}
            className={classes['job-mes']}
          >
            <Form
              form={addEditForm}
              onFinish={handleFormFinish}
              initialValues={{
                jobGroup: 'DEFAULT',
                misfirePolicy: '3',
                concurrent: '1',
                status: '1',
              }}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item labelCol={{ span: 8 }} label="任务名称" name="jobName" rules={[{ required: true, message: '请输入任务名称!' }]}>
                    <Input placeholder="请输入任务名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item labelCol={{ span: 8 }} label="任务组名" name="jobGroup">
                    <Select
                      placeholder="任务组名"
                      allowClear
                      options={dictJobGroup.map((item) => ({
                        value: item.dictValue,
                        label: item.dictLabel,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="调用方法"
                labelCol={{ span: 4 }}
                name="invokeTarget"
                rules={[{ required: true, message: '请输入调用方法!' }]}
                tooltip="
              函数调用示例：addEditFn('ry')
              参数说明：支持无参（addEditFn）、单参数（addEditFn('ry')）、多参数（addEditFn('ry',true, 2000)），以你后台封装函数为基准"
              >
                <Input placeholder="请输入调用方法" />
              </Form.Item>
              <Form.Item label="cron表达式" labelCol={{ span: 4 }} name="cronExpression" rules={[{ required: true, message: '请输入cron表达式!' }]}>
                <Input
                  placeholder="请输入cron表达式"
                  addonAfter={
                    <Button icon={<FieldTimeOutlined />} type="ghost" onClick={() => setIsCronOpen(true)}>
                      生成表达式
                    </Button>
                  }
                />
              </Form.Item>
              <Form.Item labelCol={{ span: 4 }} label="执行策略" name="misfirePolicy">
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="1">立即执行</Radio.Button>
                  <Radio.Button value="2">执行一次</Radio.Button>
                  <Radio.Button value="3">放弃执行</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item labelCol={{ span: 8 }} label="是否并发" name="concurrent">
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value="0">允许</Radio.Button>
                      <Radio.Button value="1">禁止</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item labelCol={{ span: 8 }} label="状态" name="status">
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

          {/* 任务详情 */}
          <Modal
            title={'任务详情'}
            open={isTaskOpen}
            onCancel={() => {
              setIsTaskOpen(false);
            }}
            width={700}
            footer={[
              <Button
                key="back"
                onClick={() => {
                  setIsTaskOpen(false);
                }}
              >
                关闭
              </Button>,
            ]}
          >
            <Form labelCol={{ span: 8 }}>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="任务编号">{currentDetail?.jobId}</Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="任务分组">{dictJobGroup.find((item) => item.dictValue === currentDetail?.jobGroup)?.dictLabel}</Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="任务名称">{currentDetail?.jobName}</Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="创建时间">{currentDetail?.createdAt}</Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="cron表达式">{currentDetail?.cronExpression}</Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="下次执行时间">{currentDetail?.nextValidTime}</Form.Item>
                </Col>
              </Row>
              <Form.Item labelCol={{ span: 4 }} label="调用目标方法">
                {currentDetail?.invokeTarget}
              </Form.Item>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="任务状态">{dictStatus.find((item) => item.dictValue === currentDetail?.status)?.dictLabel}</Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="是否并发">{concurrentDict.find((item) => item.value === currentDetail?.concurrent)?.label}</Form.Item>
                </Col>
              </Row>
              <Form.Item labelCol={{ span: 4 }} label="执行策略">
                {misfirePolicyDict.find((item) => item.value === currentDetail?.misfirePolicy)?.label}
              </Form.Item>
            </Form>
          </Modal>

          {/* cron */}
          <Modal
            title={'Cron表达式生成器'}
            open={isCronOpen}
            onCancel={() => {
              setIsCronOpen(false);
            }}
            footer={[
              <Button
                key={1}
                onClick={() => {
                  confirmResetCron();
                  setIsCronOpen(false);
                }}
                type="primary"
              >
                确认
              </Button>,
              <Button onClick={() => confirmResetCron('reset')} key={2}>
                重置
              </Button>,
              <Button
                key={3}
                onClick={() => {
                  const { resetCronState } = cronRef.current as unknown as IcronComeType;
                  setIsCronOpen(false);
                  resetCronState();
                }}
              >
                取消
              </Button>,
            ]}
            width={700}
          >
            <Cron cronExpression={currentDetail.cronExpression as string} ref={cronRef} />
          </Modal>
        </Col>
      </Row>
    </div>
  );
};

export default MonitorJob;
