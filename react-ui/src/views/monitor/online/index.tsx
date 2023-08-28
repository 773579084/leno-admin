import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Col, Row, Tooltip, Table, Pagination, Modal, message } from 'antd'
import {
  SyncOutlined,
  SearchOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getListAPI, delAPI } from '@/api/modules/monitor/online'
import { IonlineType } from '@/type/modules/monitor/online'
import ColorBtn from '@/components/ColorBtn'
import dayjs from 'dayjs'
import { hasPermi } from '@/utils/auth'
import { pageDelJump } from '@/utils'

const Online: React.FC = () => {
  const [queryForm] = Form.useForm()
  const { confirm } = Modal

  // 分页
  const [queryParams, setQueryParams] = useState<IonlineType>({ pageNum: 1, pageSize: 10 })
  // 列表数据
  const [dataList, setDataList] = useState({ count: 0, rows: [] as IonlineType[] })
  // table loading
  const [loading, setLoading] = useState(true)
  // 非多个禁用
  const [multiple, setMultiple] = useState(true)
  // 保存table 选择的key
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([])
  //  table 后台使用的key
  const [rowKeys, setRowKeys] = useState('')
  // 控制搜索隐藏显示
  const [searchShow, setSearchShow] = useState(true)

  useEffect(() => {
    getList()
  }, [queryParams])

  // 查询列表
  const getList = async () => {
    try {
      const { data } = await getListAPI(queryParams)

      setDataList({ ...data.result })
      setLoading(false)
    } catch (error) {}
  }

  // 搜索
  const searchQueryFn = () => {
    let { createdAt, ...form } = queryForm.getFieldsValue()
    if (createdAt) {
      form = {
        ...form,
        loginTime: {
          beginTime: dayjs(createdAt[0]).format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(createdAt[1]).format('YYYY-MM-DD HH:mm:ss'),
        },
      }
    }
    setQueryParams({
      pageNum: 1,
      pageSize: 10,
      ...form,
    })
  }

  // 重置
  const resetQueryFn = () => {
    queryForm.resetFields()
    setSelectKeys([])
    setQueryParams({ pageNum: 1, pageSize: 10 })
  }

  // row-select
  const rowSelection = {
    selectedRowKeys: selectKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: IonlineType[]) => {
      selectedRowKeys.length ? setMultiple(false) : setMultiple(true)
      setSelectKeys(selectedRowKeys)
      setRowKeys(selectedRowKeys.join(','))
    },
  }

  // 分页
  const onPagChange = async (pageNum: number, pageSize: number) => {
    setQueryParams({ pageNum, pageSize })
  }

  // 删除
  const delFn = (ids: string) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除编号为"${ids}"的数据项？`,
      centered: true,
      async onOk() {
        try {
          const { data } = await delAPI(ids)
          message.success(data.message)

          pageDelJump(dataList.count, ids, queryParams, setQueryParams)
        } catch (error) {}
      },
    })
  }

  // table
  let columns = [
    {
      title: '会话编辑',
      dataIndex: 'tokenId',
      key: 'tokenId',
      align: 'center',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
    },
    {
      title: '部门名称',
      dataIndex: 'deptName',
      key: 'deptName',
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
      title: '访问时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
      align: 'center',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      width: 150,
      render: (_: any, record: IonlineType) => (
        <div>
          <Button
            hidden={hasPermi('monitor:online:forceLogout')}
            size="small"
            icon={<DeleteOutlined />}
            type="link"
            onClick={() => delFn(String(record.tokenId))}
          >
            强退
          </Button>
        </div>
      ),
    },
  ] as ColumnsType<IonlineType>

  // table 数据源
  const tableData = dataList.rows

  return (
    <div className="app-container">
      <Row gutter={16}>
        <Col span={24}>
          <Form form={queryForm} hidden={!searchShow} layout="inline" className="leno-search">
            <Form.Item label="登录地址" name="ipaddr">
              <Input
                style={{ width: 240 }}
                placeholder="请输入登录地址"
                allowClear
                onPressEnter={searchQueryFn}
              />
            </Form.Item>
            <Form.Item label="用户名称" name="userName">
              <Input
                style={{ width: 240 }}
                placeholder="请输入用户名称"
                allowClear
                onPressEnter={searchQueryFn}
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
                    hidden={hasPermi('monitor:online:batchLogout')}
                    onClick={() => delFn(rowKeys)}
                    color="danger"
                    disabled={multiple}
                    icon={<DeleteOutlined />}
                  >
                    批量强退
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
                        setSearchShow(!searchShow)
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
                        searchQueryFn()
                        setSelectKeys([])
                      }}
                    />
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="leno-table">
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              rowKey="tokenId"
              size="middle"
              loading={loading}
              rowSelection={{ type: 'checkbox', fixed: 'left', ...rowSelection }}
            />
            <Pagination
              className="pagination"
              onChange={onPagChange}
              total={dataList.count}
              showSizeChanger
              showQuickJumper
              current={queryParams.pageNum}
              showTotal={(total) => `共 ${total} 条`}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Online
