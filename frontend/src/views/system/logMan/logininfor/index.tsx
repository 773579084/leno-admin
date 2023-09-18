import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, DatePicker, Col, Row, Tooltip, Table, Pagination, Modal, message } from 'antd';
import { SyncOutlined, SearchOutlined, DeleteOutlined, ExclamationCircleOutlined, VerticalAlignBottomOutlined, UnlockOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getListAPI, delAPI, cleanAPI } from '@/api/modules/system/logininfor';
import { getDictsApi } from '@/api/modules/system/dictData';
import { download } from '@/api';
import { IlogininforType } from '@/type/modules/system/logininfor';
import ColorBtn from '@/components/ColorBtn';
import { IdictType } from '@/type/modules/system/sysDictData';
import DictTag from '@/components/DictTag';

import dayjs from 'dayjs';
import { hasPermi } from '@/utils/auth';
import { pageDelJump } from '@/utils';

const { RangePicker } = DatePicker;

const SysLogininfor: React.FC = () => {
  const [queryForm] = Form.useForm();
  const { confirm } = Modal;

  // 分页
  const [queryParams, setQueryParams] = useState<IlogininforType>({ pageNum: 1, pageSize: 10 });
  // 列表数据
  const [dataList, setDataList] = useState({ count: 0, rows: [] as IlogininforType[] });
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

  const [dictStatus, setDictStatus] = useState<IdictType[]>([]);

  useEffect(() => {
    const getDictsFn = async () => {
      try {
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
    let { loginTime, ...form } = queryForm.getFieldsValue();
    if (loginTime) {
      form = {
        ...form,
        loginTime: {
          beginTime: dayjs(loginTime[0]).format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(loginTime[1]).format('YYYY-MM-DD HH:mm:ss'),
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
      content: `是否确认清空所有登录日志数据项？`,
      centered: true,
      onOk: async () => {
        try {
          const { data } = await cleanAPI();
          message.success(data.message);
          setQueryParams({
            pageNum: 1,
            pageSize: queryParams.pageSize,
          });
        } catch (error) {}
      },
    });
  };

  // 解锁
  const unlockFn = (ids: string) => {
    /*  */
  };

  // table
  const columns = [
    {
      title: '访问编码',
      dataIndex: 'infoId',
      key: 'infoId',
      align: 'center',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
    },
    {
      title: '登录地址',
      dataIndex: 'ipaddr',
      key: 'ipaddr',
      align: 'center',
    },
    {
      title: '登录地点',
      dataIndex: 'loginLocation',
      key: 'loginLocation',
      align: 'center',
    },
    {
      title: '浏览器类型',
      dataIndex: 'browser',
      key: 'browser',
      align: 'center',
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      key: 'os',
      align: 'center',
    },
    {
      title: '登录状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value) => <DictTag options={dictStatus} value={value} />,
    },
    {
      title: '提示消息',
      dataIndex: 'msg',
      key: 'msg',
      align: 'center',
    },
    {
      title: '访问时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
      align: 'center',
    },
  ] as ColumnsType<IlogininforType>;

  // table 数据源
  const tableData = dataList.rows;

  return (
    <div className="app-container">
      <Row gutter={16}>
        <Col span={24}>
          <Form form={queryForm} hidden={!searchShow} layout="inline" className="leno-search">
            <Form.Item label="用户名称" name="userName">
              <Input style={{ width: 240 }} placeholder="请输入用户名称" allowClear onPressEnter={searchQueryFn} />
            </Form.Item>
            <Form.Item label="登录地址" name="ipaddr">
              <Input style={{ width: 240 }} placeholder="请输入登录地址" allowClear onPressEnter={searchQueryFn} />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select
                style={{ width: 240 }}
                placeholder="登录状态"
                allowClear
                options={dictStatus.map((item) => ({
                  value: item.dictValue,
                  label: item.dictLabel,
                }))}
              />
            </Form.Item>
            <Form.Item label="访问时间" name="loginTime">
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
                  <ColorBtn hidden={hasPermi('monitor:logininfor:remove')} onClick={() => delFn(rowKeys)} disabled={multiple} color="danger" icon={<DeleteOutlined />}>
                    删除
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn hidden={hasPermi('monitor:logininfor:remove')} onClick={delAllFn} color="danger" icon={<DeleteOutlined />}>
                    清空
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn hidden={hasPermi('monitor:logininfor:unlock')} onClick={() => unlockFn(rowKeys)} disabled={multiple} color="primary" icon={<UnlockOutlined />}>
                    解锁
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('monitor:logininfor:export')}
                    color="warning"
                    icon={<VerticalAlignBottomOutlined />}
                    onClick={() => {
                      try {
                        download('/system/logininfor/export');
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
            <Table columns={columns} dataSource={tableData} pagination={false} rowKey="infoId" size="middle" loading={loading} rowSelection={{ type: 'checkbox', fixed: 'left', ...rowSelection }} />
            <Pagination className="pagination" onChange={onPagChange} total={dataList.count} showSizeChanger showQuickJumper current={queryParams.pageNum} showTotal={(total) => `共 ${total} 条`} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SysLogininfor;
