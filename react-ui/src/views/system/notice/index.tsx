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
  BellOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getListAPI, delAPI, getDetailAPI, addAPI, putAPI } from '@/api/modules/system/notice'
import { getDictsApi } from '@/api/modules/system/dictData'
import { InoticeType } from '@/type/modules/system/notice'
import ColorBtn from '@/components/ColorBtn'
import { IdictType } from '@/type/modules/system/sysDictData'
import DictTag from '@/components/DictTag'
import TextEditor from '@/components/TextEditor'
import { IDomEditor } from '@wangeditor/editor'
import { commonDelImgAPI } from '@/api/modules/common'
import { hasPermi } from '@/utils/auth'
import useStore from '@/store'
import { pageDelJump } from '@/utils'

const SysNotice: React.FC = () => {
  const [queryForm] = Form.useForm()
  const [addEditForm] = Form.useForm()
  const { confirm } = Modal
  const {
    useSocketStore: { socket },
  } = useStore()

  // 分页
  const [queryParams, setQueryParams] = useState<InoticeType>({ pageNum: 1, pageSize: 10 })
  // 列表数据
  const [dataList, setDataList] = useState({ count: 0, rows: [] as InoticeType[] })
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
  // editor
  const editorRef = useRef()
  const [editorHtml, setEditorHtml] = useState<string>('')
  const [imgs, setImgs] = useState<string>('')

  const [dictNoticeType, setDictNoticeType] = useState<IdictType[]>([])
  const [dictStatus, setDictStatus] = useState<IdictType[]>([])

  useEffect(() => {
    const getDictsFn = async () => {
      try {
        const sys_notice_type = await getDictsApi('sys_notice_type')
        setDictNoticeType(sys_notice_type.data.result)
        const sys_notice_status = await getDictsApi('sys_notice_status')
        setDictStatus(sys_notice_status.data.result)
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

  // 添加编辑 确认
  const addEditFn = async () => {
    const { editor, html, uploadedImg } = editorRef.current as unknown as {
      editor: IDomEditor
      html: string
      uploadedImg: string[]
    }
    // 1 获取富文本保存的 图片
    const saveImgs = editor.getElemsByType('image') as unknown as {
      src: string
    }[]
    // 2 用保存全部图片的 uploadedImg 对比 saveImgs 得出需要删除的img 调用后端接口删除图片
    const delImgs: string[] = []
    const uploadImgs: string[] = []

    uploadedImg.forEach((item) => {
      if (
        !saveImgs.find((value) => value.src.split('/')[value.src.split('/').length - 1] === item)
      ) {
        delImgs.push(item)
      } else {
        uploadImgs.push(item)
      }
    })
    setImgs(JSON.stringify(uploadImgs))

    try {
      const { data } = await commonDelImgAPI(delImgs)
      message.success(data.message)
      // 3 将 html 存储到 form 表单
      addEditForm.setFieldValue('noticeContent', html)
      addEditForm.submit()
    } catch (error) {}
  }

  // row-select
  const rowSelection = {
    selectedRowKeys: selectKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: InoticeType[]) => {
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
      setEditorHtml(data.result.noticeContent as string)
      setImgs(data.result.imgs as string)
      addEditForm.setFieldsValue(data.result as unknown as InoticeType)
      setCurrentId(id)
      setIsModalOpen(true)
      setIsAdd(false)
    } catch (error) {}
  }

  // 表单提交
  const handleFormFinish = async (values: InoticeType) => {
    try {
      if (isAdd) {
        await addAPI({ ...values, imgs: imgs })
      } else {
        await putAPI({ ...values, imgs: imgs, noticeId: currentId })
      }
      addEditForm.resetFields()
      getList()
      setIsModalOpen(false)
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

  // 发送通知
  const sendNotice = (res: InoticeType) => {
    if (res.status === '0') {
      const noticeData = dictNoticeType.find((item) => {
        return item.dictValue === res.noticeType
      })
      try {
        socket.emit('postNotice', res)
        message.success(`发送${noticeData?.dictLabel}成功`)
      } catch (error) {
        message.success(`发送${noticeData?.dictLabel}失败，请联系管理员`)
      }
    } else {
      message.success(`请更改公告状态再通知`)
    }
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
      title: '公告标题',
      dataIndex: 'noticeTitle',
      key: 'noticeTitle',
      align: 'center',
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: '公告类型',
      dataIndex: 'noticeType',
      key: 'noticeType',
      align: 'center',
      render: (value) => <DictTag options={dictNoticeType} value={value} />,
    },
    {
      title: '公告状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value) => <DictTag options={dictStatus} value={value} />,
    },
    {
      title: '创建者',
      dataIndex: 'createBy',
      key: 'createBy',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: ' createdAt',
      align: 'center',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      width: 240,
      render: (_: any, record: InoticeType) => (
        <div>
          <Button
            hidden={hasPermi('system:notice:notice')}
            onClick={() => sendNotice(record)}
            size="small"
            icon={<BellOutlined />}
            type="link"
          >
            通知
          </Button>
          <Button
            hidden={hasPermi('system:notice:edit')}
            onClick={() => handleEditForm(record.noticeId as number)}
            size="small"
            icon={<EditOutlined />}
            type="link"
          >
            修改
          </Button>
          <Button
            hidden={hasPermi('system:notice:remove')}
            size="small"
            icon={<DeleteOutlined />}
            type="link"
            onClick={() => delFn(String(record.noticeId))}
          >
            删除
          </Button>
        </div>
      ),
    },
  ] as ColumnsType<InoticeType>

  // table 数据源
  const tableData = dataList.rows

  return (
    <div className="app-container">
      <Row gutter={16}>
        <Col span={24}>
          <Form form={queryForm} hidden={!searchShow} layout="inline" className="leno-search">
            <Form.Item label="公告标题" name="noticeTitle">
              <Input
                style={{ width: 240 }}
                placeholder="请输入公告标题"
                allowClear
                onPressEnter={searchQueryFn}
              />
            </Form.Item>
            <Form.Item label="操作人员" name="createBy">
              <Input
                style={{ width: 240 }}
                placeholder="请输入操作人员"
                allowClear
                onPressEnter={searchQueryFn}
              />
            </Form.Item>
            <Form.Item label="类型" name="noticeType">
              <Select
                style={{ width: 240 }}
                placeholder="公告类型"
                allowClear
                options={dictNoticeType.map((item) => ({
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
                    hidden={hasPermi('system:notice:add')}
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setEditorHtml('')
                      setIsAdd(true)
                      setIsModalOpen(true)
                    }}
                  >
                    新增
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('system:notice:edit')}
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
                    hidden={hasPermi('system:notice:remove')}
                    onClick={() => delFn(rowKeys)}
                    disabled={multiple}
                    color="danger"
                    icon={<DeleteOutlined />}
                  >
                    删除
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
              rowKey="noticeId"
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
            title={isAdd ? '添加通知公告' : '编辑通知公告'}
            open={isModalOpen}
            onOk={addEditFn}
            onCancel={() => {
              setIsModalOpen(false)
              addEditForm.resetFields()
            }}
            width={900}
          >
            <Form
              form={addEditForm}
              labelCol={{ span: 3 }}
              onFinish={handleFormFinish}
              initialValues={{
                status: '0',
              }}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="公告标题"
                    name="noticeTitle"
                    hidden={false}
                    rules={[{ required: true, message: '请输入公告标题!' }]}
                    labelCol={{ span: 6 }}
                  >
                    <Input placeholder="请输入公告标题" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="公告类型"
                    name="noticeType"
                    rules={[{ required: true, message: '请选择公告类型!' }]}
                    labelCol={{ span: 6 }}
                  >
                    <Select
                      placeholder="公告类型"
                      allowClear
                      options={dictNoticeType.map((item) => ({
                        value: item.dictValue,
                        label: item.dictLabel,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="公告状态" name="status">
                <Radio.Group
                  options={dictStatus.map((item) => ({
                    value: item.dictValue,
                    label: item.dictLabel,
                  }))}
                />
              </Form.Item>
              <Form.Item label="公告内容" name="noticeContent" hidden={false}>
                <TextEditor ref={editorRef} editorHtml={editorHtml} imgs={imgs} />
              </Form.Item>
            </Form>
          </Modal>
        </Col>
      </Row>
    </div>
  )
}

export default SysNotice
