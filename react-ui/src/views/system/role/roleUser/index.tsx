import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Col, Row, Tooltip, Table, Pagination, Modal, message } from 'antd'
import {
  SyncOutlined,
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getListAPI, delAPI, addAPI, getUnallocatedListAPI } from '@/api/modules/system/roleUser'
import { getDictsApi } from '@/api/modules/system/dictData'
import { IroleUserType } from '@/type/modules/system/roleUser'
import ColorBtn from '@/components/ColorBtn'
import { IdictType } from '@/type/modules/system/sysDictData'
import DictTag from '@/components/DictTag'
import { userQueryType } from '@/type/modules/system/sysUser'
import useStore from '@/store'
import { toJS } from 'mobx'
import { tbasType } from '@/type/modules/Layout'
import { useNavigate, useParams } from 'react-router-dom'

const LenoUser: React.FC = () => {
  const [queryForm] = Form.useForm()
  const [selectUserForm] = Form.useForm()
  const { confirm } = Modal
  const { roleId } = useParams()

  const {
    useLayoutStore: { defaultObjMobx, changeTabsListMobx },
  } = useStore()
  const navigate = useNavigate()

  // 分页
  const [queryParams, setQueryParams] = useState<IroleUserType>({
    pageNum: 1,
    pageSize: 10,
    roleId: roleId,
  })
  // 选择用户分页
  const [selectUserQueryParams, setSelectUserQueryParams] = useState<userQueryType>({
    pageNum: 1,
    pageSize: 10,
    roleId: roleId,
  })
  // 列表数据
  const [dataList, setDataList] = useState({ count: 0, rows: [] as IroleUserType[] })
  // 选择用户分页列表数据
  const [selectUserDataList, setSelectUserDataList] = useState({
    count: 0,
    rows: [] as IroleUserType[],
  })
  // table loading
  const [loading, setLoading] = useState(true)
  // 新增 model显隐
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 非多个禁用
  const [multiple, setMultiple] = useState(true)
  // 控制搜索隐藏显示
  const [searchShow, setSearchShow] = useState(true)
  // 保存table 选择的key
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([])
  //  table 后台使用的key
  const [rowKeys, setRowKeys] = useState('')
  // 选择用户 保存table 选择的key
  const [selectUserKeys, setSelectUserKeys] = useState<React.Key[]>([])
  // 选择用户 table 后台使用的key
  const [selectUserRowKeys, setSelectUserRowKeys] = useState('')

  const [dictStatus, setDictStatus] = useState<IdictType[]>([])

  useEffect(() => {
    const getDictsFn = async () => {
      try {
        const sys_normal_disable = await getDictsApi('sys_normal_disable')
        setDictStatus(sys_normal_disable.data.result)
      } catch (error) {}
    }
    getDictsFn()
  }, [])

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

  useEffect(() => {
    getSelectUserList()
  }, [selectUserQueryParams])

  // 查询选择用户列表
  const getSelectUserList = async () => {
    try {
      const { data } = await getUnallocatedListAPI(selectUserQueryParams)
      setSelectUserDataList({ ...data.result })
      setLoading(false)
    } catch (error) {}
  }

  // 搜索
  const searchQueryFn = () => {
    let form = queryForm.getFieldsValue()
    setQueryParams({
      pageNum: 1,
      pageSize: 10,
      roleId: roleId,
      ...form,
    })
  }
  // 搜索 选择用户
  const selectUserSearchQueryFn = () => {
    let form = selectUserForm.getFieldsValue()
    setSelectUserQueryParams({
      pageNum: 1,
      pageSize: 10,
      roleId: roleId,
      ...form,
    })
  }

  // 重置
  const resetQueryFn = () => {
    queryForm.resetFields()
    setSelectKeys([])
    setQueryParams({ pageNum: 1, pageSize: 10, roleId: roleId })
  }
  // 重置 选择用户
  const selectUserResetQueryFn = () => {
    selectUserForm.resetFields()
    setSelectUserKeys([])
    setSelectUserQueryParams({ pageNum: 1, pageSize: 10, roleId: roleId })
  }

  // row-select
  const rowSelection = {
    selectedRowKeys: selectKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: IroleUserType[]) => {
      setSelectKeys(selectedRowKeys)
      selectedRowKeys.length ? setMultiple(false) : setMultiple(true)
      setRowKeys(selectedRowKeys.join(','))
    },
  }

  // row-select selectUser
  const rowSelectUserSelection = {
    selectedRowKeys: selectUserKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: IroleUserType[]) => {
      setSelectUserKeys(selectedRowKeys)
      selectedRowKeys.length ? setMultiple(false) : setMultiple(true)
      setSelectUserRowKeys(selectedRowKeys.join(','))
    },
  }

  // 分页
  const onPagChange = async (pageNum: number, pageSize: number) => {
    setQueryParams({ pageNum, pageSize, roleId: roleId })
  }

  // 分页用户列表
  const onSelectUserPagChange = async (pageNum: number, pageSize: number) => {
    setSelectUserQueryParams({ pageNum, pageSize, roleId: roleId })
  }

  // 取消授权
  const cancelPowerFn = (query: { roleId: string; userId: string }) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `是否确认取消授权编号为"${query.userId}"的数据项？`,
      centered: true,
      async onOk() {
        try {
          const { data } = await delAPI(query)
          message.success(data.message)
          const pageNum = Math.ceil(
            (dataList.count - query.userId.split(',').length) / queryParams.pageSize,
          )
          setQueryParams({
            pageNum: pageNum || 1,
            pageSize: queryParams.pageSize,
            roleId: roleId,
          })
        } catch (error) {}
      },
    })
  }

  // 关闭
  const closePage = () => {
    const tabs = toJS(defaultObjMobx.tabsListMobx) as tbasType[]
    changeTabsListMobx(
      tabs.filter((tab) => tab.path.indexOf(`roleUser/${roleId}` as string) === -1),
    )
    navigate('/system/role')
  }

  // 选择用户 确认
  const selectUserConfirm = async () => {
    try {
      const { data } = await addAPI({
        roleId: roleId as string,
        userId: selectUserRowKeys,
      })
      message.success(data.message)
      setIsModalOpen(false)
      setSelectUserKeys([])
      setSelectKeys([])
      setQueryParams({
        pageNum: 1,
        pageSize: 10,
        roleId: roleId,
      })
    } catch (error) {}
  }

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
      title: '用户账号',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      align: 'center',
    },
    {
      title: '用户邮箱',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
      key: 'phonenumber',
      align: 'center',
    },
    {
      title: '账号状态',
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
      render: (_: any, record: IroleUserType) => (
        <div>
          <Button
            size="small"
            icon={<CloseCircleOutlined />}
            type="link"
            onClick={() =>
              cancelPowerFn({
                roleId: roleId as string,
                userId: String(record.userId) as string,
              })
            }
          >
            取消授权
          </Button>
        </div>
      ),
    },
  ] as ColumnsType<IroleUserType>
  // table 数据源
  const tableData = dataList.rows

  // selectUser
  const selectUserCoumns = [
    {
      title: '用户账号',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      align: 'center',
    },
    {
      title: '用户邮箱',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
      key: 'phonenumber',
      align: 'center',
    },
    {
      title: '账号状态',
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
  ] as ColumnsType<IroleUserType>
  const tableSelectData = selectUserDataList.rows

  return (
    <div className="app-container">
      <Row gutter={16}>
        <Col span={24}>
          <Form form={queryForm} hidden={!searchShow} layout="inline" className="leno-search">
            <Form.Item label="用户账号" name="userName">
              <Input
                style={{ width: 240 }}
                placeholder="请输入用户账号"
                allowClear
                onPressEnter={searchQueryFn}
              />
            </Form.Item>
            <Form.Item label="手机号码" name="phonenumber">
              <Input
                style={{ width: 240 }}
                placeholder="请输入手机号码"
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
                    icon={<PlusOutlined />}
                    onClick={() => {
                      getSelectUserList()
                      setIsModalOpen(true)
                    }}
                  >
                    添加用户
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    onClick={() =>
                      cancelPowerFn({
                        roleId: roleId as string,
                        userId: rowKeys as string,
                      })
                    }
                    disabled={multiple}
                    color="danger"
                    icon={<CloseCircleOutlined />}
                  >
                    批量取消授权
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn color="warning" icon={<CloseOutlined />} onClick={closePage}>
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
              rowSelection={{ type: 'checkbox', fixed: 'left', ...rowSelection }}
              columns={columns}
              dataSource={tableData}
              pagination={false}
              rowKey="userId"
              size="middle"
              loading={loading}
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

          {/* 选择用户 */}
          <Modal
            title={'选择用户'}
            open={isModalOpen}
            onOk={selectUserConfirm}
            onCancel={() => {
              setIsModalOpen(false)
              selectUserForm.resetFields()
            }}
            width={850}
          >
            <Form form={selectUserForm} layout="inline" className="leno-search">
              <Form.Item label="用户账号" name="userName">
                <Input
                  style={{ width: 200 }}
                  placeholder="请输入用户账号"
                  allowClear
                  onPressEnter={selectUserSearchQueryFn}
                />
              </Form.Item>
              <Form.Item label="手机号码" name="phonenumber">
                <Input
                  style={{ width: 200 }}
                  placeholder="请输入手机号码"
                  allowClear
                  onPressEnter={selectUserSearchQueryFn}
                />
              </Form.Item>
              <Form.Item>
                <Button onClick={selectUserSearchQueryFn} type="primary" icon={<SearchOutlined />}>
                  搜索
                </Button>
              </Form.Item>
              <Form.Item>
                <Button onClick={selectUserResetQueryFn} icon={<SyncOutlined />}>
                  重置
                </Button>
              </Form.Item>
              <div style={{ width: 100 + '%' }} className="leno-table">
                <Table
                  rowSelection={{ type: 'checkbox', fixed: 'left', ...rowSelectUserSelection }}
                  columns={selectUserCoumns}
                  dataSource={tableSelectData}
                  pagination={false}
                  rowKey="userId"
                  size="middle"
                  loading={loading}
                />
                <Pagination
                  className="pagination"
                  onChange={onSelectUserPagChange}
                  total={selectUserDataList.count}
                  showSizeChanger
                  showQuickJumper
                  current={selectUserQueryParams.pageNum}
                  showTotal={(total) => `共 ${total} 条`}
                />
              </div>
            </Form>
          </Modal>
        </Col>
      </Row>
    </div>
  )
}

export default LenoUser
