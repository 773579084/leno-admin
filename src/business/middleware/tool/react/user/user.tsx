import React, { useState, useEffect, useRef } from 'react'
import {
  Button,
  Form,
  Input,
  Select,
  Col,
  Row,
  Tooltip,
  Table,
  Pagination,
  Modal,
  Radio,
  message,
} from 'antd'
import {
  SyncOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  getListAPI,
  delAPI,
  getDetailAPI,
  addAPI,
  putAPI,
} from '@/api/modules/system/user'
import { getDictsApi } from '@/api/modules/system/dictData'
import { download } from '@/api'
import { IuserType  } from '@/type/modules/system/user'
import ColorBtn from '@/components/ColorBtn'
import { hasPermi } from '@/utils/auth'
import { IdictType } from '@/type/modules/system/sysDictData'

const LenoUser = () => {
  const [queryForm] = Form.useForm()
  const [addEditForm] = Form.useForm()
  const { confirm } = Modal

  // 分页
  const [queryParams, setQueryParams] = useState<IuserType>({ pageNum: 1, pageSize: 10 })
  // 列表数据
  const [dataList, setDataList] = useState({ count: 0, rows: [] as IuserType[] })
  // table loading
  const [loading, setLoading] = useState(true)
  // 新增编辑 model显隐
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 新增编辑判断
  const [isAdd, setIsAdd] = useState(true)
  // 非单个禁用
  const [single, setSingle] = useState(true)
  // 非多个禁用
  const [multiple, setMultiple] = useState(true)
  // 保存table 选择的key
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([])
  //  table 后台使用的key
  const [rowKeys, setRowKeys] = useState('')
  // 控制搜索隐藏显示
  const [searchShow, setSearchShow] = useState(true)
  // 当前编辑的id
  const [currentId, setCurrentId] = useState<number>()
  
  useEffect(() => {
    try {
      const getDictsFn = async () => {
        }
      getDictsFn()
    } catch (error) {}
  }, [])

  useEffect(() => {
    getList()
  }, [queryParams])

  // 查询列表
  const getList = async () => {
    try {
      const { data } = await getListAPI(queryParams)
      setDataList({ ...data.result })
      
      message.success('查询成功')
      setLoading(false)
    } catch (error) {}
  }

  // 搜索
  const searchQueryFn = () => {
    let form = queryForm.getFieldsValue()
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
    onChange: (selectedRowKeys: React.Key[], selectedRows: IuserType[]) => {
      if (!selectedRowKeys.length || selectedRowKeys.length > 1) {
        setSingle(true)
      } else {
        setSingle(false)
      }
      selectedRowKeys.length ? setMultiple(false) : setMultiple(true)
      setSelectKeys(selectedRowKeys)
      setRowKeys(selectedRowKeys.join(','))
    },
  }

  // 获取详情
  const handleEditForm = async (id: number) => {
    try {
      const { data } = await getDetailAPI(id)
      setCurrentId(id)
      setIsModalOpen(true)
      setIsAdd(false)
      addEditForm.setFieldsValue(data.result as unknown as IuserType)
    } catch (error) {}
  }

  // 表单提交
  const handleFormFinish = async (values: IuserType) => {
    try {
      if (isAdd) {
        await addAPI({ ...values })
        message.success('新增成功')
      } else {
        await putAPI({ ...values,  userId: currentId })
        message.success('修改成功')
      }
      
    } catch (error) {}
    setIsModalOpen(false)
    addEditForm.resetFields()
    getList()
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
          await delAPI(ids)
          message.success('删除成功')
          getList()
        } catch (error) {}
      },
    })
  }

  // table
  let columns = [
    {
      title: '编码',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (text, record, index) => index + 1, // 渲染序号
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      render: (_: any, record: IuserType) => (
        <div>
          <Button
            hidden={hasPermi('system:user:edit')}
            onClick={() => handleEditForm(record.userId as number)}
            size="small"
            icon={<EditOutlined />}
            type="link"
          >
            修改
          </Button>
          <Button
            hidden={hasPermi('system:user:remove')}
            size="small"
            icon={<DeleteOutlined />}
            type="link"
            onClick={() => delFn(String(record.userId))}
          >
            删除
          </Button>
        </div>
      ),
    },
  ] as ColumnsType<IuserType>

  // table 数据源
  const tableData = dataList.rows

  return (
  <div className="app-container">
    <Row gutter={16}>
      <Col span={24}>
        <Form
          form={queryForm}
          hidden={!searchShow}
          layout="inline"
          className="leno-search"
        >
          
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
                  hidden={hasPermi('system:user:add')}
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setIsModalOpen(true)
                    setIsAdd(true)
                  }}
                >
                  新增
                </ColorBtn>
              </Col>
              <Col>
                  <ColorBtn
                    hidden={hasPermi('system:user:edit')}
                    disabled={single}
                    color="success"
                    icon={<EditOutlined />}
                    onClick={() => handleEditForm(Number(rowKeys))}
                  >
                    修改
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('system:user:remove')}
                    onClick={() => delFn(rowKeys)}
                    disabled={multiple}
                    color="danger"
                    icon={<DeleteOutlined />}
                  >
                    删除
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('system:user:export')}
                    color="warning"
                    icon={<VerticalAlignBottomOutlined />}
                    onClick={() => download('/system/user/export')}
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
            rowKey="userId"
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

        {/* 添加 编辑 */}
        <Modal
          title={isAdd ? '添加用户信息' : '编辑用户信息'}
          open={isModalOpen}
          onOk={() => addEditForm.submit()}
          onCancel={() => {
            setIsModalOpen(false)
            
            addEditForm.resetFields()
          }}
        >
          <Form
            form={addEditForm}
            labelCol={{ span: 5 }}
            onFinish={handleFormFinish}
          >
            
          </Form>
        </Modal>
      </Col>
    </Row>
  </div>
  )
}

export default LenoUser