import { Modal, Tabs, Button, message } from 'antd'
import React, { useState, memo } from 'react'
import { CopyOutlined } from '@ant-design/icons'
import { arePropsEqual } from '@/utils'

export type ImportTableType = {
  onCancel: () => void
  isPreviewOpen: boolean
  codePreviewData: any
  codePreviewSource: any
}

const Preview: React.FC<ImportTableType> = (props) => {
  const { isPreviewOpen, onCancel, codePreviewData, codePreviewSource } = props
  const [tabName, setTabName] = useState('')

  const copyCode = () => {
    message.success('复制成功')
    navigator.clipboard.writeText(codePreviewSource[tabName])
  }

  return (
    <Modal
      title="导入表"
      open={isPreviewOpen}
      width={1200}
      footer={null}
      onCancel={onCancel}
      style={{ position: 'relative' }}
    >
      <Tabs onChange={(key: string) => setTabName(key)} items={codePreviewData} />
      <Button
        style={{ position: 'absolute', right: 35, top: 150, color: 'white' }}
        type="text"
        icon={<CopyOutlined />}
        onClick={copyCode}
      >
        复制
      </Button>
    </Modal>
  )
}
export default memo(Preview, arePropsEqual)
