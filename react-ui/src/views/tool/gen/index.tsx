import React, { useState, useEffect } from 'react'
import {
  Button,
  Form,
  Input,
  DatePicker,
  Col,
  Row,
  Tooltip,
  Table,
  Pagination,
  Modal,
  message,
} from 'antd'
import {
  SyncOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  VerticalAlignBottomOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { codePreviewAPI, delAPI, genCodeAPI, getListAPI } from '@/api/modules/tool/gen'
import { GenType, ILimitAPI, IPreview } from '@/type/modules/tool/gen'
const { RangePicker } = DatePicker
import ColorBtn from '@/components/ColorBtn'
import dayjs from 'dayjs'
import Preview from './component/Preview'
import { useNavigate } from 'react-router-dom'
import ImportTable from './component/ImportTable'
import OmsSyntaxHighlight from './component/OmsSyntaxHighlight'
import { download } from '@/api'
import { hasPermi } from '@/utils/auth'
import { pageDelJump } from '@/utils'

const Gen: React.FC = () => {
  const [queryForm] = Form.useForm()
  const { confirm } = Modal
  const navigate = useNavigate()

  // 分页
  const [queryParams, setQueryParams] = useState<ILimitAPI>({ pageNum: 1, pageSize: 10 })
  // 列表数据
  const [dataList, setDataList] = useState({ count: 0, rows: [] as any })
  // table loading
  const [loading, setLoading] = useState(true)
  // 预览 model显隐
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
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
  // 导入 model显隐
  const [isImportOpen, setIsImportOpen] = useState(false)
  // 代码预览
  const [codePreviewData, setCodePreviewData] = useState<IPreview[]>()
  // 代码预览的数据代码
  const [codePreviewSource, setCodePreviewSource] = useState({})

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
        beginTime: dayjs(createdAt[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: dayjs(createdAt[1]).format('YYYY-MM-DD HH:mm:ss'),
      }
    }
    setQueryParams({
      pageNum: 1,
      pageSize: 10,
      ...form,
    })
  }

  const resetQueryFn = () => {
    queryForm.resetFields()
    setSelectKeys([])
    setQueryParams({ pageNum: 1, pageSize: 10 })
  }

  // row-select
  const rowSelection = {
    selectedRowKeys: selectKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: GenType[]) => {
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
          const { data } = await delAPI(ids)
          message.success(data.message)
          setSelectKeys([])

          pageDelJump(dataList.count, ids, queryParams, setQueryParams)
        } catch (error) {}
      },
    })
  }

  // 预览
  const codePreview = async (id: number) => {
    try {
      const { data } = await codePreviewAPI(id)
      setCodePreviewSource(data.result)

      const previewItems = []
      for (let key in data.result) {
        previewItems.push({
          label: key,
          key: key,
          children: <OmsSyntaxHighlight textContent={data.result[key]} language={'typescript'} />,
        })
      }
      setCodePreviewData(previewItems)
      setIsPreviewOpen(true)
    } catch (error) {}
  }

  // table columns
  let columns = [
    {
      title: '序号',
      dataIndex: 'tableId',
      key: 'tableId',
      align: 'center',
    },
    {
      title: '表名称',
      dataIndex: 'tableName',
      key: 'tableName',
      align: 'center',
      width: '80px',
    },
    {
      title: '表描述',
      dataIndex: 'tableComment',
      key: 'tableComment',
      align: 'center',
      width: '150px',
    },
    {
      title: '实体',
      dataIndex: 'className',
      key: 'className',
      align: 'center',
      width: '150px',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: '180px',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
      width: '180px',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      render: (_: any, record) => (
        <div>
          <Button
            hidden={hasPermi('tool:gen:preview')}
            onClick={() => codePreview(record.tableId)}
            size="small"
            icon={<EyeOutlined />}
            type="link"
          >
            预览
          </Button>
          <Button
            hidden={hasPermi('tool:gen:edit')}
            onClick={() => {
              navigate(`/tool/genEdit/${record.tableId}`)
            }}
            size="small"
            icon={<EditOutlined />}
            type="link"
          >
            修改
          </Button>
          <Button
            hidden={hasPermi('tool:gen:remove')}
            size="small"
            icon={<DeleteOutlined />}
            type="link"
            onClick={() => delFn(`${record.tableId}`)}
          >
            删除
          </Button>
          <Button
            hidden={hasPermi('tool:gen:code')}
            onClick={async () => {
              try {
                record.genType === '0'
                  ? download(
                      `/tool/gen/batchGenCode/generatedCode/${record.tableId}`,
                      'leno-admin',
                      'zip',
                    )
                  : await genCodeAPI(record.tableId)
                message.success('代码生成完成')
              } catch (error) {}
            }}
            size="small"
            icon={<DownloadOutlined />}
            type="link"
          >
            生成代码
          </Button>
        </div>
      ),
    },
  ] as ColumnsType<GenType>

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
            initialValues={{ remember: true }}
            autoComplete="off"
            className="leno-search"
          >
            <Form.Item label="表名称" name="tableName">
              <Input
                style={{ width: 240 }}
                placeholder="请输入表名称"
                allowClear
                onPressEnter={searchQueryFn}
              />
            </Form.Item>
            <Form.Item label="表描述" name="tableComment">
              <Input
                style={{ width: 240 }}
                placeholder="请输入表描述"
                allowClear
                onPressEnter={searchQueryFn}
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
                    hidden={hasPermi('tool:gen:code')}
                    color="warning"
                    icon={<VerticalAlignBottomOutlined />}
                    onClick={() => {
                      try {
                        download(
                          `/tool/gen/batchGenCode/generatedCode/${rowKeys}`,
                          'leno-admin',
                          'zip',
                        )
                      } catch (error) {}
                    }}
                  >
                    生成
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('tool:gen:import')}
                    color="info"
                    icon={<CloudUploadOutlined />}
                    onClick={() => {
                      setIsImportOpen(true)
                    }}
                  >
                    导入
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('tool:gen:edit')}
                    disabled={single}
                    color="success"
                    icon={<EditOutlined />}
                    onClick={() => {
                      navigate(`/tool/genEdit/${rowKeys}`)
                    }}
                  >
                    修改
                  </ColorBtn>
                </Col>
                <Col>
                  <ColorBtn
                    hidden={hasPermi('tool:gen:remove')}
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
              rowKey="tableId"
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

          {/* 预览 */}
          <Preview
            isPreviewOpen={isPreviewOpen}
            codePreviewData={codePreviewData}
            codePreviewSource={codePreviewSource}
            onCancel={() => {
              setIsPreviewOpen(false)
            }}
          />

          {/* 导入 */}
          <ImportTable
            isImportOpen={isImportOpen}
            onCancel={() => {
              setIsImportOpen(false)
            }}
            onSubmit={() => {
              setIsImportOpen(false)
              getList()
            }}
          />
        </Col>
      </Row>
    </div>
  )
}

export default Gen
