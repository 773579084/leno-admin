import SysNotice from '@/mysql/model/system/notice.model'
import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { formatHumpLineTransfer } from '.'
import { queryConditionsData } from '../service'

export const wsNotice = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on('postNotice', async (data) => {
    console.log(10, data)
    // 发送立即通知
    socket.emit('getNotice', data)
    // 更新通知公告
    socket.emit('getAllNotice', await getAllNoticeFn())
  })

  socket.emit('getAllNotice', await getAllNoticeFn())

  socket.on('disconnect', (reason) => {
    console.log('socket已断开')
  })
}

async function getAllNoticeFn() {
  return formatHumpLineTransfer(await queryConditionsData(SysNotice, { status: '0' }))
}
