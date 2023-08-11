import { Badge, Popover, Tabs } from 'antd'
import { useState } from 'react'
import { NotificationOutlined } from '@ant-design/icons'
import classes from './index.module.scss'

const NoticeCom = () => {
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const onChange = (key: string) => {
    console.log(key)
  }

  const noticeDiv = (
    <div className={classes['notice-div']}>
      <Tabs
        defaultActiveKey="1"
        onChange={onChange}
        items={[
          {
            label: `通知`,
            key: '1',
            children: (
              <>
                <div className={classes['notice-content']}>111</div>
                <div className={classes['notice-content']}>222</div>
              </>
            ),
          },
          {
            label: `公告`,
            key: '2',
            children: (
              <>
                <div className={classes['notice-content']}>111</div>
                <div className={classes['notice-content']}>222</div>
              </>
            ),
          },
        ]}
      />
    </div>
  )

  return (
    <Popover content={noticeDiv} trigger="click" open={open} onOpenChange={handleOpenChange}>
      <Badge dot={show}>
        <NotificationOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
      </Badge>
    </Popover>
  )
}

export default NoticeCom
