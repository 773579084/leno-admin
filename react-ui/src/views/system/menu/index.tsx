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
  message,
  Modal,
  Radio,
  InputNumber,
  TreeSelect,
  Popover,
} from 'antd'
import {
  SyncOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SwapOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getListAPI, addAPI, delAPI, getDetailAPI, putAPI } from '@/api/modules/system/menu'
// components
import ColorBtn from '@/components/ColorBtn'
import DictTag from '@/components/DictTag'
import IconSelect from '@/components/IconSelect'
import { menusType, ILimitAPI } from '@/type/modules/system/menu'
import { IdictType } from '@/type/modules/system/sysDictData'
import { getDictsApi } from '@/api/modules/system/dictData'
import { generalTreeFn } from '@/utils/tree'
import SvgIcon from '@/components/SvgIcon'
import { hasPermi } from '@/utils/auth'

const Menu: React.FC = () => {
  const [queryForm] = Form.useForm()
  const [addEditForm] = Form.useForm()
  const { confirm } = Modal

  // 分页
  const [queryParams, setQueryParams] = useState<ILimitAPI>({})
  // 列表数据
  const [dataList, setDataList] = useState<menusType[]>([])
  // 保存编辑当前id
  const [currentId, setCurrentId] = useState<number>()
  // table loading
  const [loading, setLoading] = useState(true)
  // 新增编辑 model显隐
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 新增编辑判断
  const [isAdd, setIsAdd] = useState(true)
  // 控制搜索隐藏显示
  const [searchShow, setSearchShow] = useState(true)
  //  行展开
  const [expandKeys, setExpandKeys] = useState<any>({})
  // 状态
  const [dictStatus, setDictStatus] = useState<IdictType[]>([])
  const [dictVisible, setDictVisible] = useState<IdictType[]>([])
  const [formData, setFormData] = useState({
    icon: '',
    menuType: 'M',
  })
  const [openPopover, setOpenPopover] = useState(false)

  useEffect(() => {
    const getDictsFn = async () => {
      try {
        const res = await getDictsApi('sys_normal_disable')
        setDictStatus(res.data.result)
        const shows = await getDictsApi('sys_show_hide')
        setDictStatus(res.data.result)
        setDictVisible(shows.data.result)
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
      data.result.sort(
        (a: { orderNum: number }, b: { orderNum: number }) => a.orderNum - b.orderNum,
      )
      const treeData = generalTreeFn(data.result, 'parentId', 'menuId') as unknown as menusType[]
      setDataList(treeData)
      setLoading(false)
    } catch (error) {}
  }

  // 搜索
  const searchQueryFn = () => {
    const form = queryForm.getFieldsValue()
    setQueryParams({
      ...form,
    })
  }

  const resetQueryFn = () => {
    queryForm.resetFields()
    setQueryParams({})
  }
  const resetFormFn = () => {
    addEditForm.resetFields()
    setFormData({ icon: '', menuType: 'M' })
  }

  const handleEditForm = async (id: number) => {
    try {
      setCurrentId(id)
      const { data } = await getDetailAPI(id)
      addEditForm.setFieldsValue(data.result)
      setFormData({ menuType: data.result?.menuType as string, icon: data.result?.icon as string })
      setIsModalOpen(true)
      setIsAdd(false)
    } catch (error) {}
  }

  const handleAddForm = (record: menusType) => {
    setIsAdd(true)
    setIsModalOpen(true)
    resetFormFn()
    addEditForm.setFieldValue('parentId', record.menuId)
  }

  const handleFormFinish = async (values: menusType) => {
    try {
      if (isAdd) {
        const { data } = await addAPI({ ...values, ...formData })
        message.success(data.message)
      } else {
        const { data } = await putAPI({ ...values, menuId: currentId as number, ...formData })
        message.success(data.message)
      }
      setIsModalOpen(false)
      resetFormFn()
      getList()
    } catch (error) {}
  }
  //#region table

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
          setQueryParams({ ...queryParams })
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
            ids.push(item.menuId as number)

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

  // table columns
  let columns = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      key: 'menuName',
      align: 'center',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      align: 'center',
      render: (icon) => <SvgIcon iconClass={icon} />,
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      key: 'orderNum',
      align: 'center',
    },
    {
      title: '权限标识',
      dataIndex: 'perms',
      key: 'perms',
      align: 'center',
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      key: 'component',
      align: 'center',
    },
    {
      title: '显隐',
      dataIndex: 'visible',
      key: 'visible',
      align: 'center',
      render: (visible, record) => {
        return record.menuType === 'F' ? null : <DictTag options={dictVisible} value={visible} />
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => <DictTag options={dictStatus} value={status} />,
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
      render: (_: any, record: menusType) => (
        <div>
          <Button
            hidden={hasPermi('system:menu:add')}
            onClick={() => handleEditForm(record.menuId as number)}
            size="small"
            icon={<EditOutlined />}
            type="link"
          >
            修改
          </Button>
          <Button
            hidden={hasPermi('system:menu:edit')}
            onClick={() => handleAddForm(record)}
            size="small"
            icon={<PlusOutlined />}
            type="link"
          >
            新增
          </Button>
          <Button
            hidden={hasPermi('system:menu:remove')}
            size="small"
            icon={<DeleteOutlined />}
            type="link"
            onClick={() => delFn(`${record.menuId}`)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ] as ColumnsType<menusType>

  // table 数据源
  const tableData = dataList

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
            <Form.Item name="menuName" label="菜单名称">
              <Input style={{ width: 240 }} placeholder="请输入菜单名称" allowClear />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select
                style={{ width: 240 }}
                placeholder="菜单状态"
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
                  <ColorBtn color="info" icon={<SwapOutlined rotate={90} />} onClick={expandFn}>
                    展开/折叠
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
              rowKey="menuId"
              size="middle"
              loading={loading}
              expandable={expandKeys}
              onExpand={() => setExpandKeys({})}
            />
          </div>

          {/* 添加 编辑 用户 */}
          <Modal
            title={isAdd ? '添加菜单' : '编辑菜单'}
            open={isModalOpen}
            onOk={() => {
              addEditForm.submit()
            }}
            width="650px"
            onCancel={() => {
              setOpenPopover(false)
              setIsModalOpen(false)
              resetFormFn()
            }}
          >
            <Form
              form={addEditForm}
              initialValues={{
                status: '0',
                parentId: 0,
                menuType: 'M',
                visible: '0',
                isCache: 0,
                isFrame: 1,
                orderNum: 0,
              }}
              onFinish={handleFormFinish}
            >
              <Form.Item
                label="上级菜单"
                name="parentId"
                rules={[{ required: true, message: '请选择上级菜单!' }]}
              >
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  fieldNames={{ value: 'menuId', label: 'menuName' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择上级菜单"
                  allowClear
                  treeDefaultExpandedKeys={[0]}
                  treeData={[
                    {
                      menuId: 0,
                      menuName: '主类目',
                      children: dataList,
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item label="菜单类型" name="menuType">
                <Radio.Group
                  onChange={(event) => {
                    setFormData({ ...formData, menuType: event.target.value })
                  }}
                >
                  <Radio value="M">目录</Radio>
                  <Radio value="C">菜单</Radio>
                  <Radio value="F">按钮</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="菜单图标" name="icon" hidden={formData.menuType === 'F'}>
                <Popover
                  open={openPopover}
                  content={
                    <IconSelect
                      onSubmit={(icon, open) => {
                        setFormData({ ...formData, icon })
                        setOpenPopover(open)
                      }}
                    />
                  }
                  trigger="click"
                  placement="bottom"
                >
                  <Input
                    prefix={
                      formData.icon ? <SvgIcon iconClass={formData.icon} /> : <SearchOutlined />
                    }
                    onClick={() => setOpenPopover(!openPopover)}
                    placeholder="请点击选择图标"
                    readOnly
                    value={formData.icon}
                  />
                </Popover>
              </Form.Item>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="菜单名称"
                    name="menuName"
                    rules={[{ required: true, message: '请输入菜单名称!' }]}
                  >
                    <Input placeholder="请输入菜单名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="显示排序"
                    name="orderNum"
                    rules={[{ required: true, message: '请输入数据键值!' }]}
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>
                <Col span={12} hidden={formData.menuType === 'F'}>
                  <Form.Item
                    label="是否外链"
                    name="isFrame"
                    tooltip="选择是外链则路由地址需要以`http(s)://`开头"
                  >
                    <Radio.Group>
                      <Radio value={0}>是</Radio>
                      <Radio value={1}>否</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12} hidden={formData.menuType === 'F'}>
                  <Form.Item
                    label="路由地址"
                    name="path"
                    rules={[{ required: formData.menuType !== 'F', message: '请输入路由地址!' }]}
                    tooltip="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                  >
                    <Input placeholder="请输入路由地址" />
                  </Form.Item>
                </Col>
                <Col span={12} hidden={formData.menuType === 'M' || formData.menuType === 'F'}>
                  <Form.Item
                    label="组件路径"
                    name="component"
                    tooltip="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                  >
                    <Input placeholder="请输入组件路径" />
                  </Form.Item>
                </Col>
                <Col span={12} hidden={formData.menuType === 'M'}>
                  <Form.Item
                    label="权限字符"
                    name="perms"
                    tooltip="控制器中定义的权限字符，如：system:user:list"
                  >
                    <Input placeholder="请输入权限字符" />
                  </Form.Item>
                </Col>
                <Col span={12} hidden={formData.menuType === 'M' || formData.menuType === 'F'}>
                  <Form.Item
                    label="路由参数"
                    name="query"
                    tooltip='访问路由的默认传递参数，如：{"id": 1, "name": "ry"}'
                  >
                    <Input placeholder="请输入路由参数" />
                  </Form.Item>
                </Col>
                <Col span={12} hidden={formData.menuType === 'M' || formData.menuType === 'F'}>
                  <Form.Item
                    label="是否缓存"
                    name="isCache"
                    tooltip="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                  >
                    <Radio.Group>
                      <Radio value={0}>缓存</Radio>
                      <Radio value={1}>不缓存</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12} hidden={formData.menuType === 'F'}>
                  <Form.Item
                    name="visible"
                    label="显示状态"
                    tooltip="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                  >
                    <Radio.Group
                      options={dictVisible.map((item) => ({
                        value: item.dictValue,
                        label: item.dictLabel,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} hidden={formData.menuType === 'F'}>
                  <Form.Item
                    label="菜单状态"
                    name="status"
                    tooltip="选择停用则路由将不会出现在侧边栏，也不能被访问"
                  >
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
        </Col>
      </Row>
    </div>
  )
}

export default Menu
