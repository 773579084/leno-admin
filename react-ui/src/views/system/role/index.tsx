import React, { useState, useEffect } from 'react'
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
  DatePicker,
  Switch,
  message,
  Checkbox,
  Tree,
  InputNumber,
  Dropdown,
  MenuProps,
} from 'antd'
import {
  SyncOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VerticalAlignBottomOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  DoubleRightOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  getListAPI,
  delAPI,
  getDetailAPI,
  addAPI,
  putAPI,
  putRoleStatusAPI,
} from '@/api/modules/system/role'
import { getDictsApi } from '@/api/modules/system/dictData'
import { download } from '@/api'
import { IroleType } from '@/type/modules/system/role'
const { RangePicker } = DatePicker
import ColorBtn from '@/components/ColorBtn'
import dayjs from 'dayjs'
import { IdictType } from '@/type/modules/system/sysDictData'
import TextArea from 'antd/lib/input/TextArea'
import useStore from '@/store'
import { menusType } from '@/type/modules/system/menu'
import { getListAPI as getMenusListApi } from '@/api/modules/system/menu'
import { generalTreeFn, solveAntHalfSelect } from '@/utils/tree'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { deptTreeAPI } from '@/api/modules/system/user'
import { IdeptResultType } from '@/type/modules/system/sysUser'
import { useNavigate } from 'react-router-dom'
import { hasPermi } from '@/utils/auth'
import { MenuInfo } from 'rc-menu/lib/interface'
import { pageDelJump } from '@/utils'

const SysRole: React.FC = () => {
  const [queryForm] = Form.useForm()
  const [addEditForm] = Form.useForm()
  const [rolePermForm] = Form.useForm()
  const { confirm } = Modal
  const {
    useUserStore: { userInfo },
  } = useStore()
  const navigate = useNavigate()

  // 分页
  const [queryParams, setQueryParams] = useState<IroleType>({ pageNum: 1, pageSize: 10 })
  // 列表数据
  const [dataList, setDataList] = useState({ count: 0, rows: [] as IroleType[] })
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
  // menus 菜单树状数据
  const [menusData, setMenusData] = useState<menusType[]>([])
  // tree 选择
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  // 半选check
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<React.Key[]>([])
  //  行展开
  const [expandKeys, setExpandKeys] = useState<React.Key[]>([])
  const [treeShow, setTreeShow] = useState<boolean>(false)
  const [treeAll, setTreeAll] = useState<boolean>(false)
  // 当前编辑的id
  const [currentId, setCurrentId] = useState<number>()
  // 分配角色数据权限对话框
  const [isPermOpen, setIsPermOpen] = useState(false)
  const [deptData, setDeptData] = useState<IdeptResultType[]>([])
  // 半选check
  const [halfDeptCheckedKeys, setHalfDeptCheckedKeys] = useState<React.Key[]>([])
  const [deptCheckedKeys, setDeptCheckedKeys] = useState<React.Key[]>([])
  const [deptExpandKeys, setDeptExpandKeys] = useState<React.Key[]>([])
  const [deptTreeShow, setDeptTreeShow] = useState<boolean>(false)
  const [deptTreeAll, setDeptTreeAll] = useState<boolean>(false)
  // 字典类型数据
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

      data.result.rows.sort((a, b) => {
        const a1 = a.roleSort as number
        const b1 = b.roleSort as number
        return a1 - b1
      })
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
        createdAt: {
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
    onChange: (selectedRowKeys: React.Key[], selectedRows: IroleType[]) => {
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
    try {
      const menusData = await getMenusData()
      const { data } = await getDetailAPI(id)
      const newSelectIds = solveAntHalfSelect(
        menusData as menusType[],
        data.result.menuIds as number[],
        'menuId',
      )
      addEditForm.setFieldsValue(data.result as unknown as IroleType)
      setCheckedKeys(newSelectIds as React.Key[])
      setCurrentId(id)
      setIsModalOpen(true)
      setIsAdd(false)
    } catch (error) {}
  }

  // 编辑
  const handleFormFinish = async (values: IroleType) => {
    try {
      if (isAdd) {
        const { data } = await addAPI({
          ...values,
          menuIds: checkedKeys.concat(halfCheckedKeys),
        })
        message.success(data.message)
      } else {
        const { data } = await putAPI({
          ...values,
          roleId: currentId,
          menuIds: checkedKeys.concat(halfCheckedKeys),
        })
        message.success(data.message)
      }
      addEditForm.resetFields()
      getList()
      setIsModalOpen(false)
    } catch (error) {}
  }

  // 分配角色数据权限对话框
  const handleRoleFormFinish = (values: IdeptResultType) => {
    message.info('该功能还未开发')
    rolePermForm.resetFields()
    setIsPermOpen(false)
  }

  // 数据权限
  const dataPermClick = async (roleId: number) => {
    try {
      const { data } = await getDetailAPI(roleId as number)
      rolePermForm.setFieldsValue(data.result as unknown as IroleType)
      // 获取部门树 数据
      const {
        data: { result },
      } = await deptTreeAPI()

      // 解决ant 半选回显全选问题
      const newSelectIds = solveAntHalfSelect(menusData, data.result.menuIds as number[], 'key')
      setDeptCheckedKeys(newSelectIds)
      setDeptData(result)
      setIsPermOpen(true)
    } catch (error) {}
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
          const { data } = await delAPI(ids)
          data.code === 200 ? message.success(data.message) : message.error(data.message)

          pageDelJump(dataList.count, ids, queryParams, setQueryParams)
        } catch (error) {}
      },
    })
  }

  // 用户状态修改
  const onUserStaChange = async (checked: string, id: number) => {
    try {
      const { data } = await putRoleStatusAPI({
        status: checked === '0' ? (checked = '1') : (checked = '0'),
        id,
      })
      message.success(data.message)
      getList()
    } catch (error) {}
  }

  // 请求菜单数据
  const getMenusData = async () => {
    try {
      const { data } = await getMenusListApi({})
      data.result.sort(
        (a: { orderNum: number }, b: { orderNum: number }) => a.orderNum - b.orderNum,
      )
      const treeData = generalTreeFn(data.result, 'parentId', 'menuId') as unknown as menusType[]
      setMenusData(treeData)
      return treeData
    } catch (error) {}
  }

  // 选择 type:menu|dept
  const onCheck = (checkedKeysValue: React.Key[], type: string) => {
    type === 'menu' ? setCheckedKeys(checkedKeysValue) : setDeptCheckedKeys(checkedKeysValue)
  }

  // 展开 type:menu|dept
  const onExpand = (expandedKeysValue: React.Key[], type: string) => {
    type === 'menu' ? setExpandKeys(expandedKeysValue) : setDeptExpandKeys(expandedKeysValue)
  }

  //展开/折叠 menu
  const onShowChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setTreeShow(true)
      const ids: number[] = []
      function checkChild(list: menusType[]) {
        list.forEach((item) => {
          if (item.children?.length) {
            ids.push(item.menuId as number)
            checkChild(item.children)
          }
        })
      }
      checkChild(menusData)
      setExpandKeys(ids)
    } else {
      setExpandKeys([])
      setTreeShow(false)
    }
  }
  //展开/折叠 dept
  const onShowPostChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setDeptTreeShow(true)
      const ids: number[] = []
      function checkChild(list: IdeptResultType[]) {
        list.forEach((item) => {
          if (item.children?.length) {
            ids.push(item.key as number)
            checkChild(item.children)
          }
        })
      }
      checkChild(deptData)
      setDeptExpandKeys(ids)
    } else {
      setDeptExpandKeys([])
      setDeptTreeShow(false)
    }
  }
  // 全选/全不选 menu
  const onAllChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setTreeAll(true)
      const ids: number[] = []
      function checkChild(list: menusType[]) {
        list.forEach((item) => {
          if (item.children?.length) {
            ids.push(item.menuId as number)
            checkChild(item.children)
          } else {
            ids.push(item.menuId as number)
          }
        })
      }
      checkChild(menusData)
      setCheckedKeys(ids)
    } else {
      setCheckedKeys([])
      setTreeAll(false)
    }
  }
  // 全选/全不选 dept
  const onAllPostChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setDeptTreeAll(true)
      const ids: number[] = []
      function checkChild(list: IdeptResultType[]) {
        list.forEach((item) => {
          if (item.children?.length) {
            ids.push(item.key as number)
            checkChild(item.children)
          } else {
            ids.push(item.key as number)
          }
        })
      }
      checkChild(deptData)
      setDeptCheckedKeys(ids)
    } else {
      setDeptCheckedKeys([])
      setDeptTreeAll(false)
    }
  }

  const dataScopeOptions = [
    {
      value: '1',
      label: '全部数据权限',
    },
    {
      value: '2',
      label: '自定数据权限',
    },
    {
      value: '3',
      label: '本部门数据权限',
    },
    {
      value: '4',
      label: '本部门及以下数据权限',
    },
    {
      value: '5',
      label: '仅本人数据权限',
    },
  ]

  const handleMenuClick = async (e: MenuInfo, record: IroleType) => {
    switch (e.key) {
      case '1':
        dataPermClick(record.roleId as number)
        break
      case '2':
        navigate(`/system/roleUser/${record.roleId}`)
        break

      default:
        break
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
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      align: 'center',
    },
    {
      title: '权限字符',
      dataIndex: 'roleKey',
      key: 'roleKey',
      align: 'center',
    },
    {
      title: '显示顺序',
      dataIndex: 'roleSort',
      key: 'roleSort',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_: any, record: IroleType) => (
        <div>
          <Switch
            checked={record.status === '0'}
            onChange={() => {
              if (record.roleKey === 'admin') {
                message.warn('超级管理员不可停用')
                return
              }
              if (record.roleKey === userInfo.userName) {
                message.warn('不可停用当前登录账号')
                return
              }
              onUserStaChange(record.status as string, record.roleId as number)
            }}
          />
        </div>
      ),
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
      render: (_: any, record: IroleType) => (
        <div hidden={record.roleKey === 'admin'}>
          <Button
            hidden={hasPermi('system:role:edit')}
            onClick={() => {
              handleEditForm(record.roleId as number)
            }}
            size="small"
            icon={<EditOutlined />}
            type="link"
          >
            修改
          </Button>
          <Button
            hidden={hasPermi('system:role:remove')}
            size="small"
            icon={<DeleteOutlined />}
            type="link"
            onClick={() => delFn(String(record.roleId))}
          >
            删除
          </Button>
          <Dropdown
            menu={{
              items,
              onClick: (e) => {
                handleMenuClick(e, record)
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
  ] as ColumnsType<IroleType>

  // table 数据源
  const tableData = dataList.rows

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div>
          <CheckCircleOutlined style={{ marginRight: 10 }} />
          数据权限
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div>
          <UserOutlined style={{ marginRight: 10 }} />
          分配用户
        </div>
      ),
    },
  ]

  return (
    <div className="app-container">
      <Row gutter={16}>
        <Col span={24}>
          <Form form={queryForm} hidden={!searchShow} layout="inline" className="leno-search">
            <Form.Item label="角色名称" name="roleName">
              <Input
                style={{ width: 240 }}
                placeholder="请输入角色名称"
                allowClear
                onPressEnter={searchQueryFn}
              />
            </Form.Item>
            <Form.Item label="权限字符" name="roleKey">
              <Input
                style={{ width: 240 }}
                placeholder="请输入权限字符"
                allowClear
                onPressEnter={searchQueryFn}
              />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Select
                style={{ width: 240 }}
                placeholder="用户状态"
                allowClear
                options={dictStatus.map((item) => ({
                  value: item.dictValue,
                  label: item.dictLabel,
                }))}
              />
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
                    hidden={hasPermi('system:role:add')}
                    icon={<PlusOutlined />}
                    onClick={() => {
                      getMenusData()
                      setIsModalOpen(true)
                      setIsAdd(true)
                    }}
                  >
                    新增
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('system:role:edit')}
                    disabled={single}
                    color="success"
                    icon={<EditOutlined />}
                    onClick={() => {
                      handleEditForm(Number(rowKeys))
                    }}
                  >
                    修改
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('system:role:remove')}
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
                    hidden={hasPermi('system:role:export')}
                    color="warning"
                    icon={<VerticalAlignBottomOutlined />}
                    onClick={() => {
                      try {
                        download('/system/role/export')
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
              rowKey="roleId"
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
            title={isAdd ? '添加角色' : '编辑角色'}
            open={isModalOpen}
            onOk={() => addEditForm.submit()}
            onCancel={() => {
              setIsModalOpen(false)
              setCheckedKeys([])
              setHalfCheckedKeys([])
              setExpandKeys([])
              setTreeShow(false)
              setTreeAll(false)
              addEditForm.resetFields()
            }}
            forceRender
          >
            <Form
              form={addEditForm}
              labelCol={{ span: 5 }}
              onFinish={handleFormFinish}
              initialValues={{
                status: '0',
                roleSort: '0',
                remark: '',
              }}
            >
              <Form.Item
                label="角色名称"
                name="roleName"
                hidden={false}
                rules={[{ required: true, message: '请输入角色名称!' }]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>
              <Form.Item
                label="权限字符"
                name="roleKey"
                hidden={false}
                rules={[{ required: true, message: '请输入权限字符!' }]}
              >
                <Input placeholder="请输入权限字符" />
              </Form.Item>
              <Form.Item
                label="显示顺序"
                name="roleSort"
                hidden={false}
                rules={[{ required: true, message: '请输入显示顺序!' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item label="状态" name="status">
                <Radio.Group
                  options={dictStatus.map((item) => ({
                    value: item.dictValue,
                    label: item.dictLabel,
                  }))}
                />
              </Form.Item>
              <Form.Item label="菜单权限">
                <Checkbox checked={treeShow} onChange={onShowChange}>
                  展开/折叠
                </Checkbox>
                <Checkbox checked={treeAll} onChange={onAllChange}>
                  全选/全不选
                </Checkbox>

                <Tree
                  checkable
                  className="tree-border"
                  fieldNames={{ key: 'menuId', title: 'menuName' }}
                  onCheck={(checkedKeysValue, e) => {
                    setHalfCheckedKeys(e.halfCheckedKeys as React.Key[])
                    onCheck(checkedKeysValue as React.Key[], 'menu')
                  }}
                  checkedKeys={checkedKeys}
                  expandedKeys={expandKeys}
                  onExpand={(values) => onExpand(values, 'menu')}
                  treeData={menusData}
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

          {/* 分配角色数据权限对话框 */}
          <Modal
            title={'分配数据权限'}
            open={isPermOpen}
            onOk={() => rolePermForm.submit()}
            onCancel={() => {
              setIsPermOpen(false)
              setDeptCheckedKeys([])
              setHalfDeptCheckedKeys([])
              setDeptExpandKeys([])
              setDeptTreeShow(false)
              setDeptTreeAll(false)
              rolePermForm.resetFields()
            }}
            forceRender
          >
            <Form
              form={rolePermForm}
              labelCol={{ span: 5 }}
              onFinish={handleRoleFormFinish}
              initialValues={{
                dataScope: '1',
              }}
            >
              <Form.Item
                label="角色名称"
                name="roleName"
                hidden={false}
                rules={[{ required: true, message: '请输入角色名称!' }]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>
              <Form.Item
                label="权限字符"
                name="roleKey"
                hidden={false}
                rules={[{ required: true, message: '请输入权限字符!' }]}
              >
                <Input placeholder="请输入权限字符" />
              </Form.Item>
              <Form.Item label="状态" name="dataScope">
                <Select
                  options={dataScopeOptions.map((item) => ({
                    value: item.value,
                    label: item.label,
                  }))}
                />
              </Form.Item>
              <Form.Item label="数据权限">
                <Checkbox checked={deptTreeShow} onChange={onShowPostChange}>
                  展开/折叠
                </Checkbox>
                <Checkbox checked={deptTreeAll} onChange={onAllPostChange}>
                  全选/全不选
                </Checkbox>

                <Tree
                  checkable
                  className="tree-border"
                  onCheck={(checkedKeysValue, e) => {
                    setHalfDeptCheckedKeys(e.halfCheckedKeys as React.Key[])
                    onCheck(checkedKeysValue as React.Key[], 'dept')
                  }}
                  checkedKeys={deptCheckedKeys}
                  expandedKeys={deptExpandKeys}
                  onExpand={(values) => onExpand(values, 'dept')}
                  treeData={deptData}
                />
              </Form.Item>
            </Form>
          </Modal>
        </Col>
      </Row>
    </div>
  )
}

export default SysRole
