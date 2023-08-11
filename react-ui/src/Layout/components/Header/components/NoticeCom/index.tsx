import { Badge, Tooltip } from 'antd'
import { useState } from 'react'
import { NotificationOutlined } from '@ant-design/icons'

const NoticeCom = () => {
  const [show, setShow] = useState(true)

  return (
    <Tooltip title="通知/公告">
      <Badge dot={show}>
        <NotificationOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
      </Badge>
    </Tooltip>
  )
}

export default NoticeCom
