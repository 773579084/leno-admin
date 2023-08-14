import useStore from '@/store'
import { InoticeType } from '@/type/modules/system/notice'
import { notification } from 'antd'
import { io } from 'socket.io-client'

const createSocket = (pathName: string) => {
  const socket = io(`${process.env.BASE_ENV}/${pathName}`, { forceNew: true })

  // 获取所有公告和通知
  socket.on('getAllNotice', (data) => {
    console.log(10, data)
  })
  // 获取单条公告和通知
  socket.on('getNotice', (data: InoticeType) => {
    console.log(29, data)
    notification.info({
      message: data.noticeTitle,
      description: <div dangerouslySetInnerHTML={{ __html: data.noticeContent as string }} />,
    })
  })

  // 推送公告

  return socket
}

export default createSocket
