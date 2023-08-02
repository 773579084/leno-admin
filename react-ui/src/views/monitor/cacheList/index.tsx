import { useEffect, useState } from 'react'
import classes from './index.module.scss'
import { Card, Row, Col, Button, Modal, Form, Input, Tooltip, message } from 'antd'
import {
  KeyOutlined,
  FileTextOutlined,
  BookOutlined,
  RedoOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import {
  getCacheListAPI,
  getCacheKeysAPI,
  getCacheContentAPI,
  clearCacheKeyAPI,
  clearCacheKeyAllAPI,
} from '@/api/modules/monitor/cache'
import { ICacheKeyType, ICacheListType } from '@/type/modules/monitor/cache'
import Table, { ColumnsType } from 'antd/lib/table'
import TextArea from 'antd/lib/input/TextArea'

const CacheList = () => {
  const [cacheForm] = Form.useForm()

  // 缓存列表
  const [cacheList, setCacheList] = useState<ICacheListType[]>()
  // 当前的缓存列表名
  const [cacheName, setCacheName] = useState('')
  // 键列表
  const [keyList, setKeyList] = useState<ICacheKeyType[]>()

  // cache loading
  const [loading, setLoading] = useState(true)
  // key loading
  const [keyLoading, setkeyLoading] = useState(false)

  const getList = async () => {
    setLoading(true)
    try {
      const {
        data: { result },
      } = await getCacheListAPI()
      setCacheList(result)
      setLoading(false)
    } catch (error) {}
  }

  useEffect(() => {
    getList()
  }, [])

  // 删除
  const delFn = async (id: string): Promise<void> => {
    try {
      await clearCacheKeyAPI(id)
      if (id.indexOf(':') !== -1) {
        getKeysList(cacheName)
        message.success(`清理缓存键名[${id}]成功`)
      } else {
        getList()
        getKeysList(cacheName)
        message.success(`清理缓存名称[${id}]成功`)
      }
    } catch (error) {}
  }

  // 获取键名列表
  const getKeysList = async (key: string) => {
    try {
      setkeyLoading(true)
      setCacheName(key)
      const {
        data: { result },
      } = await getCacheKeysAPI(key)
      const keysList = result.map((item) => {
        return {
          cacheKey: item,
        }
      })
      setKeyList(keysList)
      setkeyLoading(false)
    } catch (error) {}
  }

  // 获取缓存内容
  const getCacheContent = async (key: string) => {
    try {
      const {
        data: { result },
      } = await getCacheContentAPI(`${cacheName}:${key}`)
      cacheForm.setFieldsValue(result)
    } catch (error) {}
  }

  // 缓存列表 table
  let columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (text, record, index) => index + 1, // 渲染序号
    },
    {
      title: '缓存名称',
      dataIndex: 'cacheName',
      key: 'cacheName',
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
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
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
      title: '操作',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      render: (_: any, record: ICacheListType) => (
        <div>
          <Button
            size="small"
            icon={<DeleteOutlined />}
            type="link"
            onClick={(event) => {
              delFn(record.cacheName)
              event.stopPropagation()
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ] as ColumnsType<ICacheListType>
  const cacheData = cacheList

  // 键名列表 table
  let keys = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (text, record, index) => index + 1, // 渲染序号
    },
    {
      title: '缓存键名',
      dataIndex: 'cacheKey',
      key: 'cacheKey',
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
      title: '操作',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      render: (_: any, record: ICacheKeyType) => (
        <div>
          <Button
            size="small"
            icon={<DeleteOutlined />}
            type="link"
            onClick={(event) => {
              delFn(cacheName + ':' + record.cacheKey)
              event.stopPropagation()
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ] as ColumnsType<ICacheKeyType>
  const keysData = keyList

  return (
    <div className="app-container">
      <div className={classes['site-layout-background']}>
        <Row gutter={24} style={{ height: 100 + '%' }}>
          <Col span={8}>
            <Card
              extra={
                <RedoOutlined
                  onClick={() => {
                    getList()
                    message.success('刷新缓存列表成功')
                  }}
                  style={{ color: '#189eff', transform: 'rotate(-90deg)' }}
                />
              }
              title={
                <div>
                  <BookOutlined /> 缓存列表
                </div>
              }
            >
              <div className="leno-table">
                <Table
                  columns={columns}
                  dataSource={cacheData}
                  pagination={false}
                  rowKey="cacheName"
                  size="middle"
                  loading={loading}
                  onRow={(record) => {
                    return {
                      onClick: (event) => {
                        getKeysList(record.cacheName)
                      },
                    }
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              extra={
                <RedoOutlined
                  onClick={() => {
                    cacheName ? getKeysList(cacheName) : null
                    message.success('刷新键名列表成功')
                  }}
                  style={{ color: '#189eff', transform: 'rotate(-90deg)' }}
                />
              }
              title={
                <div>
                  <KeyOutlined /> 键名列表
                </div>
              }
            >
              <div className="leno-table">
                <Table
                  columns={keys}
                  dataSource={keysData}
                  pagination={false}
                  rowKey="cacheKey"
                  size="middle"
                  loading={keyLoading}
                  onRow={(record) => {
                    return {
                      onClick: (event) => {
                        getCacheContent(record.cacheKey)
                      },
                    }
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              extra={
                <div
                  onClick={async () => {
                    try {
                      cacheForm.resetFields()
                      await clearCacheKeyAllAPI()
                      message.success('清理全部缓存成功')
                    } catch (error) {}
                  }}
                  style={{ color: '#189eff', cursor: 'pointer' }}
                >
                  <RedoOutlined style={{ color: '#189eff', transform: 'rotate(-90deg)' }} />{' '}
                  清理全部
                </div>
              }
              title={
                <div>
                  <FileTextOutlined /> 缓存内容
                </div>
              }
            >
              <Form form={cacheForm} layout="vertical">
                <Form.Item label="缓存名称：" name="cacheName">
                  <Input />
                </Form.Item>
                <Form.Item label="缓存键名：" name="cacheKey">
                  <Input />
                </Form.Item>
                <Form.Item label="缓存内容：" name="cacheValue">
                  <TextArea style={{ height: '40vh' }} />
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default CacheList
