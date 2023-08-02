import { Transfer } from 'antd'
import React, { useEffect, useState, memo } from 'react'
import { Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DataType } from '@/type'
import { arePropsEqual } from '@/utils'

interface RecordType {
  key: string
  title: string
  dataIndex: string
  align: string
  width: string
}

export type AddEditFormProps = {
  onSubmit: (newColumns?: string[]) => void
  onCancel: () => void
  showHiddenOpen: boolean
  columns: ColumnsType<DataType>
}

const ShowHiddleColumn: React.FC<AddEditFormProps> = (props) => {
  const { showHiddenOpen, columns, onSubmit, onCancel } = props
  const [mockData, setMockData] = useState<RecordType[]>([])
  const [targetKeys, setTargetKeys] = useState<string[]>([])

  // modal 弹框
  const handleOk = () => {
    onSubmit(targetKeys)
  }
  const handleCancel = () => {
    onCancel()
  }

  const getMock = () => {
    setMockData(JSON.parse(JSON.stringify(columns)))
  }

  useEffect(() => {
    getMock()
  }, [])

  const filterOption = (inputValue: string, option: RecordType) =>
    option.title.indexOf(inputValue) > -1

  const handleChange = (newTargetKeys: string[]) => {
    setTargetKeys(newTargetKeys)
  }

  return (
    <Modal
      title={'显示/隐藏'}
      open={showHiddenOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
    >
      <Transfer
        dataSource={mockData}
        showSearch
        filterOption={filterOption}
        targetKeys={targetKeys}
        onChange={handleChange}
        render={(item) => item.title}
      />
    </Modal>
  )
}

export default memo(ShowHiddleColumn, arePropsEqual)
