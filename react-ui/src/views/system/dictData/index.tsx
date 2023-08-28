import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Button,
  Form,
  Input,
  Select,
  Col,
  Row,
  Tooltip,
  Table,
  message,
  Pagination,
  Modal,
  Radio,
  InputNumber,
  Tag,
} from 'antd'
import {
  SyncOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VerticalAlignBottomOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  getListAPI,
  delTypeAPI,
  getTypeAPI,
  addTypeAPI,
  putTypeAPI,
  getDictsApi,
} from '@/api/modules/system/dictData'
import { getOptionselectAPI } from '@/api/modules/system/dictType'
import { download } from '@/api'
import { IdictType, ILimitAPI, dictTableType } from '@/type/modules/system/sysDictData'
// components
import ColorBtn from '@/components/ColorBtn'
import DictTag from '@/components/DictTag'
// mobx
import useStore from '@/store'
import { toJS } from 'mobx'
import { IdictDataType, tbasType } from '@/type'
import { pageDelJump } from '@/utils'

const DictData: React.FC = () => {
  const { TextArea } = Input
  const [queryForm] = Form.useForm()
  const [addEditform] = Form.useForm()
  const { confirm } = Modal
  const { dictType } = useParams()
  const navigate = useNavigate()
  const {
    useLayoutStore: { defaultObjMobx, changeTabsListMobx },
  } = useStore()

  // 分页
  const [queryParams, setQueryParams] = useState<ILimitAPI>({
    pageNum: 1,
    pageSize: 10,
  })
  // 列表数据
  const [dataList, setDataList] = useState({ count: 0, rows: [] as IdictType[] })
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
  // 控制搜索隐藏显示
  const [searchShow, setSearchShow] = useState(true)
  // 保存table 选择的key
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([])
  // table 后台使用的key
  const [rowKeys, setRowKeys] = useState('')
  // 保存 dictType select
  const [optionselect, setOptionselect] = useState<IdictDataType[]>([])
  // 当前编辑的id
  const [currentId, setCurrentId] = useState<number>()
  // 状态
  const [dictStatus, setDictStatus] = useState<IdictType[]>([])

  useEffect(() => {
    const getOptionselect = async () => {
      try {
        const { data } = await getOptionselectAPI()
        const res = await getDictsApi('sys_normal_disable')
        setDictStatus(res.data.result)
        setOptionselect(data.result)
      } catch (error) {}
    }
    getOptionselect()
  }, [])

  useEffect(() => {
    resetQueryFn()
  }, [dictType])

  useEffect(() => {
    if (queryParams.dictType) {
      getList()
    }
  }, [queryParams])

  // 查询列表
  const getList = async () => {
    try {
      const res = await getListAPI(queryParams)
      setDataList(res.data.result)
      setLoading(false)
    } catch (error) {}
  }

  // 搜索
  const searchQueryFn = () => {
    const form = queryForm.getFieldsValue()
    setQueryParams({
      pageNum: 1,
      pageSize: 10,
      ...form,
    })
  }

  const resetQueryFn = () => {
    queryForm.resetFields()
    queryForm.setFieldsValue({ dictType })
    addEditform.setFieldsValue({ dictType })
    setSelectKeys([])
    setQueryParams({ pageNum: 1, pageSize: 10, dictType })
  }

  const closePage = () => {
    const tabs = toJS(defaultObjMobx.tabsListMobx) as tbasType[]
    changeTabsListMobx(tabs.filter((tab) => tab.path.indexOf(dictType as string) === -1))
    navigate('/system/dictType')
  }

  // row-select
  const rowSelection = {
    selectedRowKeys: selectKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: dictTableType[]) => {
      if (!selectedRowKeys.length || selectedRowKeys.length > 1) {
        setSingle(true)
      } else {
        setSingle(false)
      }
      setSelectKeys(selectedRowKeys)
      selectedRowKeys.length ? setMultiple(false) : setMultiple(true)
      setRowKeys(selectedRowKeys.join(','))
    },
  }

  const handleEditForm = async (id: number) => {
    const { data } = await getTypeAPI(id)
    setCurrentId(id)
    setIsModalOpen(true)
    setIsAdd(false)
    addEditform.setFieldsValue(data.result as unknown as IdictType)
  }

  const handleFormFinish = async (values: IdictType) => {
    try {
      if (isAdd) {
        const { data } = await addTypeAPI(values)
        message.success(data.message)
      } else {
        const { data } = await putTypeAPI({ ...values, dictCode: currentId })
        message.success(data.message)
      }
      setIsModalOpen(false)
      addEditform.resetFields()
      addEditform.setFieldsValue({ dictType })
      getList()
    } catch (error) {}
  }

  //#region table
  // 分页
  const onPagChange = async (pageNum: number, pageSize: number) => {
    setQueryParams({ pageNum, pageSize })
  }

  // 删除
  const delFn = (ids: string) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除字典编号为"${ids}"的数据项？`,
      centered: true,
      async onOk() {
        try {
          const { data } = await delTypeAPI(ids)
          message.success(data.message)

          pageDelJump(dataList.count, ids, queryParams, setQueryParams)
        } catch (error) {}
      },
    })
  }

  // table columns
  let columns = [
    {
      title: '字典编号',
      dataIndex: 'dictCode',
      key: 'dictCode',
      align: 'center',
    },
    {
      title: '字典标签',
      dataIndex: 'dictLabel',
      key: 'dictLabel',
      align: 'center',
      // 此传值方法是为渲染字典标签的样式，其他通用的传值需按照下方status传值
      render: (_: any, record: IdictType) => (
        <div>
          {record.listClass === 'empty' || record.listClass === '' ? (
            <span>{record.dictLabel}</span>
          ) : (
            <Tag style={{ marginRight: 0 }} color={record.listClass}>
              {record.dictLabel}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: '字典键值',
      dataIndex: 'dictValue',
      key: 'dictValue',
      align: 'center',
    },
    {
      title: '字典排序',
      dataIndex: 'dictSort',
      key: 'dictSort',
      align: 'center',
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
      render: (_: any, record: IdictType) => (
        <div>
          <Button
            onClick={() => handleEditForm(record.dictCode as number)}
            size="small"
            icon={<EditOutlined />}
            type="link"
          >
            修改
          </Button>
          <Button
            size="small"
            icon={<DeleteOutlined />}
            type="link"
            onClick={() => delFn(String(record.dictCode))}
          >
            删除
          </Button>
        </div>
      ),
    },
  ] as ColumnsType<dictTableType>

  // table 数据源
  const tableData = dataList.rows
  //#endregion

  return (
    <div className="app-container">
      <Row gutter={16}>
        <Col span={24}>
          <Form
            form={queryForm}
            hidden={!searchShow}
            layout="inline"
            name={'query'}
            initialValues={{}}
            autoComplete="off"
            className="leno-search"
          >
            <Form.Item name="dictType" label="字典名称">
              <Select
                style={{ width: 240 }}
                placeholder="字典名称"
                options={optionselect.map((item) => ({
                  value: item.dictType,
                  label: item.dictName,
                }))}
              />
            </Form.Item>
            <Form.Item label="字典标签" name="dictLabel">
              <Input
                style={{ width: 240 }}
                placeholder="请输入字典类型"
                allowClear
                onPressEnter={searchQueryFn}
              />
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
                      setIsModalOpen(true)
                      setIsAdd(true)
                    }}
                  >
                    新增
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
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
                    color="warning"
                    icon={<VerticalAlignBottomOutlined />}
                    onClick={() => {
                      try {
                        download('/system/dict/data/export')
                      } catch (error) {}
                    }}
                  >
                    导出
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    color="warning"
                    icon={<CloseOutlined />}
                    onClick={() => {
                      closePage()
                    }}
                  >
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
              rowKey="dictCode"
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

          {/* 添加 编辑 用户 */}
          <Modal
            title={isAdd ? '添加字典数据' : '编辑字典数据'}
            open={isModalOpen}
            onOk={() => {
              addEditform.submit()
            }}
            onCancel={() => {
              setIsModalOpen(false)
              addEditform.resetFields()
              addEditform.setFieldsValue({ dictType })
            }}
            forceRender
          >
            <Form
              form={addEditform}
              name={'addEdit'}
              labelCol={{ span: 6 }}
              initialValues={{
                status: '0',
                dictSort: 0,
                listClass: 'empty',
              }}
              onFinish={handleFormFinish}
            >
              <Form.Item label="字典类型" name="dictType">
                <Input placeholder="请输入字典类型" disabled />
              </Form.Item>
              <Form.Item
                label="数据标签"
                name="dictLabel"
                rules={[{ required: true, message: '请输入数据标签!' }]}
              >
                <Input placeholder="请输入数据标签" />
              </Form.Item>

              <Form.Item
                label="数据键值"
                name="dictValue"
                rules={[{ required: true, message: '请输入数据键值!' }]}
              >
                <Input placeholder="请输入数据键值" />
              </Form.Item>
              <Form.Item label="样式属性" name="cssClass">
                <Input placeholder="请输入数据键值" />
              </Form.Item>
              <Form.Item
                label="显示排序"
                name="dictSort"
                rules={[{ required: true, message: '请输入数据键值!' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item label="回显样式" name="listClass">
                <Select
                  placeholder="请选择"
                  style={{ width: 120 }}
                  options={[
                    {
                      value: 'empty',
                      label: '默认',
                    },
                    {
                      value: 'processing',
                      label: '主要',
                    },
                    {
                      value: 'success',
                      label: '成功',
                    },
                    {
                      value: 'default',
                      label: '信息',
                    },
                    {
                      value: 'warning',
                      label: '警告',
                    },
                    {
                      value: 'error',
                      label: '危险',
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item label="状态" name="status">
                <Radio.Group
                  options={dictStatus.map((item) => ({
                    value: item.dictValue,
                    label: item.dictLabel,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="备注"
                name="remark"
                rules={[{ max: 200, message: '请输入内容(200字以内)!' }]}
              >
                <TextArea showCount placeholder="请输入内容(200字以内)" rows={3} />
              </Form.Item>
            </Form>
          </Modal>
        </Col>
      </Row>
    </div>
  )
}

export default DictData
