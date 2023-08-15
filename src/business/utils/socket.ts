import SysNotice from '@/mysql/model/system/notice.model'
import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { formatHumpLineTransfer } from '.'
import { queryConditionsData } from '../service'
import jwt from 'jsonwebtoken'
import env from '@/config/default'
import { IuserTokenType } from '@/types/auth'
import { judgeKeyOverdue } from './auth'

export const wsNotice = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  const token = socket.handshake.query.token

  if (judgeToken(token as string)) {
    socket.on('postNotice', async (data) => {
      // 向所有的socket发送通知
      socket.broadcast.emit('getNotice', data)
      socket.emit('getNotice', data)

      // 向所有的socket更新通知公告
      socket.emit('getAllNotice', await getAllNoticeFn())
      socket.broadcast.emit('getAllNotice', await getAllNoticeFn())
    })

    socket.emit('getAllNotice', await getAllNoticeFn())

    socket.on('disconnect', (reason) => {
      console.log('socket已断开')
    })
  } else {
    socket.disconnect(true)
    console.error('token过期，断开socket连接')
  }
}

/**
 * 查询所有通知公告
 * @returns
 */
async function getAllNoticeFn() {
  return formatHumpLineTransfer(await queryConditionsData(SysNotice, { status: '0' }))
}

/**
 * 判断token是否有效
 * @param token
 * @returns
 */
async function judgeToken(token: string) {
  const user = jwt.verify(token, env().JWT_SECRET) as IuserTokenType
  return await judgeKeyOverdue(user.session)
}
