import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

export const wsNotice = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  console.log('New client connected')

  socket.on('postNotice', (data) => {
    console.log(10, data)
    // 在这里处理接收到的消息
    socket.emit('getNotice', data)
  })

  socket.emit('getAllNotice', new Date())
}
