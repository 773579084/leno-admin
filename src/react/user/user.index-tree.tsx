import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Col,
  Row,
  Tooltip,
  Table,
  Pagination,
  Modal,
  Radio,
} from 'antd'
import {
  SyncOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VerticalAlignBottomOutlined,
  ExclamationCircleOutlined,
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
import { IuserType  ,ITreeType} from '@/type/modules/system/user'
const { RangePicker } = DatePicker
import ColorBtn from '@/components/ColorBtn'
import dayjs from 'dayjs'
import { IdictType } from '@/type/modules/system/sysDictData'
import DictTag from '@/components/DictTag'
import { treeDataFn } from '@/utils/smallUtils'

const LenoUser: React.FC = () => {
  const { TextArea } = Input
  const [queryForm] = Form.useForm()
  const [AddEditForm] = Form.useForm()
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
  // 控制搜索隐藏显示
  const [searchShow, setSearchShow] = useState(true)
  // 保存table 选择的key
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([])
  //  table 后台使用的key
  const [rowKeys, setRowKeys] = useState('')
    //  行展开
  const [expandKeys, setExpandKeys] = useState<any>({})
  const [dictUserId, setDictUserId] = useState<IdictType[]>([])
    const [dictDeptId, setDictDeptId] = useState<IdictType[]>([])
    
  useEffect(() => {
    const getDictsFn = async () => {
    const sys_show_hide = await getDictsApi('sys_show_hide')
      setDictUserId(sys_show_hide.data.result)
    const sys_normal_disable = await getDictsApi('sys_normal_disable')
      setDictDeptId(sys_normal_disable.data.result)
    }
    getDictsFn()
  }, [])

  useEffect(() => {
    getList()
  }, [queryParams])

  // 查询列表
  const getList = async () => {
    const { data } = await getListAPI(queryParams)
    const treeData = treeDataFn<menusType>(data.result)
    setDataList(treeData)
    setLoading(false)
  }

  // 搜索
  const searchQueryFn = () => {
    let { createdAt, ...form } = queryForm.getFieldsValue()
      if (createdAt) {
        form = {
          ...form,
          nickName:{
            beginTime: dayjs(createdAt[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs(createdAt[1]).format('YYYY-MM-DD HH:mm:ss'),
          }
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
    onChange: (selectedRowKeys: React.Key[], selectedRows: IuserType[]) => {
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

  // 获取详情
  const handleEditForm = async (id: number) => {
    setIsModalOpen(true)
    setIsAdd(false)
    const { data } = await getDetailAPI(id)
    AddEditForm.setFieldsValue(data.result as unknown as IuserType)
  }

  // 编辑
  const handleFormFinish = async (values: IuserType) => {
    try {
      if (isAdd) {
        await addAPI(values)
      } else {
        await putAPI({ ...values, userId: values.userId })
      }
    } catch (error) {}
    AddEditForm.resetFields()
    getList()
    setIsModalOpen(false)
  }

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
          await delAPI(ids)
          getList()
        } catch (error) {}
      },
    })
  }

    // 行展开
  const expandFn = () => {
    if (expandKeys['expandedRowKeys'] && expandKeys['expandedRowKeys'].length) {
      setExpandKeys({
        expandedRowKeys: [],
      })
    } else {
      setExpandKeys({
        expandedRowKeys: [],
      })
      const ids: number[] = []
      function checkChild(list: menusType[]) {
        list.forEach((item) => {
          if (item.children?.length) {
            ids.push(item.userId as number)

            checkChild(item.children)
          }
        })
      }
      checkChild(dataList)
      setExpandKeys({
        expandedRowKeys: ids,
      })
    }
  }

  // table
  let columns = [
    {
      title: '字典编码',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (text, record, index) => index + 1, // 渲染序号
    },
    {
          title: '用户id',
          dataIndex: 'userId',
          key: 'userId',
          align: 'center',
          render: (value) => <DictTag options={dictUserId} value={value} />,},
    {
          title: '部门ID',
          dataIndex: 'deptId',
          key: 'deptId',
          align: 'center',
          render: (value) => <DictTag options={dictDeptId} value={value} />,},
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
          title: '用户类型 0 管理员 , 1 非管理员',
          dataIndex: 'userType',
          key: 'userType',
          align: 'center',
          render: (value) => <DictTag options={dictUserType} value={value} />,},
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      render: (_: any, record: IuserType) => (
        <div>
          <Button
            onClick={() => handleEditForm(record.userId as number)}
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
    <Row gutter={16}>
      <Col span={24}>
        <Form
          form={queryForm}
          hidden={!searchShow}
          layout="inline"
          className="leno-search"
        >
          <Form.Item name="userId" label="用户id">
            <Select
              style={{ width: 240 }}
              placeholder="用户id"
              allowClear
              options={dictUserId.map((item) => ({
                value: item.dictValue,
                label: item.dictLabel,
              }))}
            />
          </Form.Item>
        <Form.Item label="部门ID" name="deptId">
          <Input
            style={{ width: 240 }}
            placeholder="请输入部门ID"
            allowClear
            onPressEnter={searchQueryFn}
          />
         </Form.Item>
        <Form.Item label="用户账号" name="userName">
          <Input
            style={{ width: 240 }}
            placeholder="请输入用户账号"
            allowClear
            onPressEnter={searchQueryFn}
          />
         </Form.Item>
        <Form.Item label="用户昵称"  name="nickName">
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
                  onClick={() => download('/system/user/export', 'sys_dict_type')}
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
            rowSelection={{ type: 'checkbox', fixed: 'left', ...rowSelection }}
            columns={columns}
            dataSource={tableData as unknown as IuserType[]}
            pagination={false}
            rowKey="userId"
            size="middle"
            loading={loading}
            expandable={expandKeys}
            onExpand={() => setExpandKeys({})}
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
          title={isAdd ? '添加用户信息' : '编辑用户信息'}
          open={isModalOpen}
          onOk={() => AddEditForm.submit()}
          onCancel={() => {
            setIsModalOpen(false)
            AddEditForm.resetFields()
          }}
          forceRender
        >
          <Form
            form={AddEditForm}
            labelCol={{ span: 6 }}
            onFinish={handleFormFinish}
          >
            <Form.Item label="用户id" name="userId">
            <Select
             placeholder="用户id"
             allowClear
             options={dictUserId.map((item) => ({
               value: item.dictValue,
               label: item.dictLabel,
             }))}
            />
           </Form.Item>
        <Form.Item
           label="部门ID"
           name="deptId"
           hidden={true}
           >
          <Input placeholder="请输入字典类型" />
        </Form.Item>
        <Form.Item
           label="用户账号"
           name="userName"
           rules={[{ max: 200, message: '请输入内容(200字以内)!' }]}
          >
          <TextArea showCount placeholder="请输入内容(200字以内)"/>
         </Form.Item>
        <Form.Item label="用户昵称"    name="nickName">
              <RangePicker style={{ width: 240 }} />
            </Form.Item>
        <Form.Item label="用户类型 0 管理员 , 1 非管理员" name="userType">
            <Radio.Group
              options={dictUserType.map((item) => ({
                value: item.dictValue,
                label: item.dictLabel,
              }))}
            />
           </Form.Item>
        <Form.Item label="用户邮箱" name="email">
            <Checkbox.Group
              options={dictEmail.map((item) => ({
                value: item.dictValue,
                label: item.dictLabel,
              }))}
            />
           </Form.Item>
        
          </Form>
        </Modal>
      </Col>
    </Row>
  )
}

export default LenoUser