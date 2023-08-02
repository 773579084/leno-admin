import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Col, Checkbox, Row, Table, Tabs, message } from 'antd'
import { ArrowUpOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getOptionselectAPI } from '@/api/modules/system/dictType'
import { IdictDataType, tbasType } from '@/type'
import ColorBtn from '@/components/ColorBtn'
import GenerateMes from './component/GenerateMes'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import BaseMes from './component/BaseMes'
import { ColumnType, GenType } from '@/type/modules/tool/gen'
import { useNavigate, useParams } from 'react-router-dom'
import { getSqlListAPI, putTableAPI } from '@/api/modules/tool/gen'
import { toJS } from 'mobx'
import useStore from '@/store'

const GenEdit: React.FC = () => {
  const [baseForm] = Form.useForm()
  const [generateForm] = Form.useForm()
  const { tableId } = useParams()
  const navigate = useNavigate()
  const {
    useLayoutStore: { defaultObjMobx, changeTabsListMobx },
  } = useStore()

  // 当前列表数据
  const [dataList, setDataList] = useState<ColumnType[]>([])
  // 当前table基础数据
  const [currentTable, setCurrentTable] = useState<GenType>()
  // table及字段数据
  const [tableList, setTableList] = useState<GenType[]>([])
  // table loading
  const [loading, setLoading] = useState(true)
  // 保存 dictType select
  const [optionselect, setOptionselect] = useState<IdictDataType[]>([])
  // tabs key
  const [tabsKey, setTabskey] = useState('2')

  useEffect(() => {
    const getDictsFn = async () => {
      try {
        const { data } = await getOptionselectAPI()
        setOptionselect(data.result)
      } catch (error) {}
    }
    getDictsFn()
    getList()
  }, [])

  // 查询列表
  const getList = async () => {
    try {
      const {
        data: {
          result: { rows },
        },
      } = await getSqlListAPI()
      setTableList(rows)

      const Gen = rows.find((row) => row.tableId === Number(tableId))
      setCurrentTable(Gen)
      setDataList(Gen?.columns as ColumnType[])
      setLoading(false)
    } catch (error) {}
  }

  // 提交
  const handleSubmitForm = async () => {
    let submitData = {} as any
    // 获取 字段信息 data
    submitData['columns'] = dataList
    // 获取基本信息

    baseForm
      .validateFields()
      .then(() => {
        submitData = {
          ...submitData,
          ...baseForm.getFieldsValue(),
        }

        generateForm
          .validateFields()
          .then(async () => {
            submitData = {
              tableId,
              ...submitData,
              ...generateForm.getFieldsValue(),
            }
            const { data } = await putTableAPI(submitData)
            message.success(data.message)
            const tabs = toJS(defaultObjMobx.tabsListMobx) as tbasType[]
            changeTabsListMobx(
              tabs.filter((tab) => tab.path.indexOf(`genEdit/${tableId}` as string) === -1),
            )
            navigate('/tool/gen')
          })
          .catch(() => {
            setTabskey('3')
          })
      })
      .catch(() => {
        setTabskey('1')
      })
  }

  //#region table
  const tableTwoWayFn = (value: string, index: number, className: string) => {
    const newDataList = JSON.parse(JSON.stringify(dataList))
    newDataList[index][className] = value
    setDataList(newDataList)
  }

  const onRadioFn = (e: CheckboxChangeEvent, index: number, className: string) => {
    const newDataList = JSON.parse(JSON.stringify(dataList))
    newDataList[index][className] = e.target.checked ? '0' : '1'
    setDataList(newDataList)
  }

  // table columns
  const htmlTypeOption = [
    {
      value: 'input',
      label: '文本框',
    },
    {
      value: 'textarea',
      label: '文本域',
    },
    {
      value: 'select',
      label: '下拉框',
    },
    {
      value: 'radio',
      label: '单选框',
    },
    {
      value: 'checkbox',
      label: '复选框',
    },
    {
      value: 'datetime',
      label: '日期控件',
    },
    {
      value: 'imageUpload',
      label: '图片上传',
    },
    {
      value: 'fileUpload',
      label: '文件上传',
    },
    {
      value: 'editor',
      label: '富文本控件',
    },
  ]
  const queryTypeOption = [
    {
      value: 'eq',
      label: '=',
    },
    {
      value: 'ne',
      label: '!=',
    },
    {
      value: 'gt',
      label: '>',
    },
    {
      value: 'gte',
      label: '>=',
    },
    {
      value: 'lt',
      label: '<',
    },
    {
      value: 'lte',
      label: '<=',
    },
    {
      value: 'like',
      label: 'LIKE',
    },
    {
      value: 'between',
      label: 'BETWEEN',
    },
  ]
  const tsTypeOption = [
    {
      value: 'string',
      label: 'String',
    },
    {
      value: 'number',
      label: 'Number',
    },
    {
      value: 'date',
      label: 'Date',
    },
    {
      value: 'boolean',
      label: 'Boolean',
    },
  ]
  const columns = [
    {
      title: '序号',
      dataIndex: 'columnId',
      key: 'columnId',
      align: 'center',
      width: '5%',
      render: (text, record, index) => index + 1, // 渲染序号
    },
    {
      title: '字段列名',
      dataIndex: 'columnName',
      key: 'columnName',
      align: 'center',
      width: '10%',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => {
            tableTwoWayFn(e.target.value, index, 'columnName')
          }}
        />
      ),
    },
    {
      title: '字段描述',
      dataIndex: 'columnComment',
      key: 'columnComment',
      align: 'center',
      width: '10%',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => {
            tableTwoWayFn(e.target.value, index, 'columnComment')
          }}
        />
      ),
    },
    {
      title: '物理类型',
      dataIndex: 'columnType',
      key: 'columnType',
      align: 'center',
    },
    {
      title: 'Ts类型',
      dataIndex: 'tsType',
      key: 'tsType',
      align: 'center',
      render: (text, record, index) => (
        <Select
          style={{ width: 120 }}
          value={text}
          onChange={(value) => {
            tableTwoWayFn(value, index, 'tsType')
          }}
          options={tsTypeOption}
        />
      ),
    },
    {
      title: 'Ts属性',
      dataIndex: 'tsField',
      key: 'tsField',
      align: 'center',
      width: '10%',
      render: (text, record, index) => (
        <Input
          onChange={(e) => {
            tableTwoWayFn(e.target.value, index, 'tsField')
          }}
          value={text}
        />
      ),
    },
    {
      title: '新增',
      dataIndex: 'isInsert',
      key: 'isInsert',
      align: 'center',
      width: '5%',
      render: (text, record, index) => (
        <Checkbox checked={text === '0'} onChange={(e) => onRadioFn(e, index, 'isInsert')} />
      ),
    },
    {
      title: '编辑',
      dataIndex: 'isEdit',
      key: 'isEdit',
      align: 'center',
      width: '5%',
      render: (text, record, index) => (
        <Checkbox checked={text === '0'} onChange={(e) => onRadioFn(e, index, 'isEdit')} />
      ),
    },
    {
      title: '列表',
      dataIndex: 'isList',
      key: 'isList',
      align: 'center',
      width: '5%',
      render: (text, record, index) => (
        <Checkbox checked={text === '0'} onChange={(e) => onRadioFn(e, index, 'isList')} />
      ),
    },
    {
      title: '查询',
      dataIndex: 'isQuery',
      key: 'isQuery',
      align: 'center',
      width: '5%',
      render: (text, record, index) => (
        <Checkbox checked={text === '0'} onChange={(e) => onRadioFn(e, index, 'isQuery')} />
      ),
    },
    {
      title: '查询方式',
      dataIndex: 'queryType',
      key: 'queryType',
      align: 'center',
      render: (text, record, index) => (
        <Select
          style={{ width: 120 }}
          value={text}
          onChange={(value) => {
            tableTwoWayFn(value, index, 'queryType')
          }}
          options={queryTypeOption}
        />
      ),
    },
    {
      title: '必填',
      dataIndex: 'isRequired',
      key: 'isRequired',
      align: 'center',
      width: '5%',
      render: (text, record, index) => (
        <Checkbox checked={text === '0'} onChange={(e) => onRadioFn(e, index, 'isRequired')} />
      ),
    },
    {
      title: '显示类型',
      dataIndex: 'htmlType',
      key: 'htmlType',
      align: 'center',
      render: (text, record, index) => (
        <Select
          style={{ width: 120 }}
          value={text}
          onChange={(value) => {
            tableTwoWayFn(value, index, 'htmlType')
          }}
          options={htmlTypeOption}
        />
      ),
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      key: 'dictType',
      align: 'center',
      render: (text, record, index) => (
        <Select
          allowClear
          style={{ width: 120 }}
          placeholder="字典类型"
          value={text}
          onChange={(value) => {
            tableTwoWayFn(value ? value : '', index, 'dictType')
          }}
          options={optionselect.map((item) => ({
            value: item.dictType,
            label: item.dictName + ` ${item.dictType}`,
          }))}
        />
      ),
    },
  ] as ColumnsType<ColumnType>

  // table 数据源
  const tableData = dataList

  const rightBtn = (
    <Row gutter={8}>
      <Col>
        <ColorBtn color="success" icon={<ArrowUpOutlined />} onClick={() => handleSubmitForm()}>
          提交
        </ColorBtn>
      </Col>
    </Row>
  )

  // 字段信息
  const fieldMes = (
    <div className="leno-table">
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        rowKey="columnId"
        size="middle"
        loading={loading}
      />
    </div>
  )

  return (
    <div className="app-container">
      <Row gutter={16}>
        <Col span={24}>
          <Tabs
            activeKey={tabsKey}
            tabBarExtraContent={rightBtn}
            onTabClick={(key: string) => {
              setTabskey(key)
            }}
            items={[
              {
                label: '基本信息',
                key: '1',
                children: <BaseMes baseForm={baseForm} currentTable={currentTable as GenType} />,
                forceRender: true,
              },
              {
                label: '字段信息',
                key: '2',
                children: fieldMes,
              },
              {
                label: '生成信息',
                key: '3',
                children: (
                  <GenerateMes
                    generateForm={generateForm}
                    columns={dataList}
                    tableList={tableList}
                    currentTable={currentTable as GenType}
                  />
                ),
                forceRender: true,
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  )
}

export default GenEdit
