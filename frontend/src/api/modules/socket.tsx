import useStore from '@/store';
import { InoticeType } from '@/type/modules/system/notice';
import { notification } from 'antd';
import { io } from 'socket.io-client';

const createSocket = (pathName: string) => {
  const {
    useSocketStore: { setNotices },
    useUserStore: { token },
  } = useStore();
  const socket = io(`${process.env.BASE_ENV}/${pathName}`, { forceNew: true, query: { token } });

  socket.on('connect', () => {
    console.log(`socket是否连接成功${socket.connected}`); // true
  });
  socket.on('connect_error', (err) => {
    console.log('socket连接失败', err);
    setTimeout(() => {
      socket.connect();
    }, 5000);
  });

  // 获取所有公告和通知
  socket.on('getAllNotice', (data: InoticeType[]) => {
    setNotices(data);
  });
  // 获取单条公告和通知
  socket.on('getNotice', (data: InoticeType) => {
    console.log(29, data);

    notification.info({
      message: data.noticeTitle,
      description: <div dangerouslySetInnerHTML={{ __html: data.noticeContent as string }} />,
    });
  });

  socket.on('disconnect', (reason) => {
    // 服务器断开socket连接时
    if (reason === 'io server disconnect') {
      socket.connect();
    }
    console.log('socket已断开', reason);
  });

  return socket;
};

export default createSocket;
