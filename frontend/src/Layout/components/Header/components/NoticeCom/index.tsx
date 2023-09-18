/* eslint-disable array-callback-return */
import { Badge, Popover, Tabs, Empty } from 'antd';
import { useEffect, useState } from 'react';
import { NotificationOutlined } from '@ant-design/icons';
import useStore from '@/store';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import classes from './index.module.scss';

const NoticeCom = () => {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const {
    useSocketStore: { notices },
  } = useStore();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    toJS(notices).length > 0 ? setShow(true) : setShow(false);
  }, [notices]);

  const noticeDiv = (
    <div className={classes['notice-div']}>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: `通知`,
            key: '1',
            children: (
              <>
                {notices.find((notice) => notice.noticeType === '1') ? (
                  toJS(notices).map((item) => {
                    if (item.noticeType === '1') {
                      return (
                        <div key={item.noticeId}>
                          <h4>{item.noticeTitle}</h4>
                          <div className={classes['notice-content']} dangerouslySetInnerHTML={{ __html: item.noticeContent as string }} />
                        </div>
                      );
                    }
                  })
                ) : (
                  <Empty description="暂无通知" />
                )}
              </>
            ),
          },
          {
            label: `公告`,
            key: '2',
            children: (
              <>
                {notices.find((notice) => notice.noticeType === '2') ? (
                  toJS(notices).map((item) => {
                    if (item.noticeType === '2') {
                      return (
                        <div key={item.noticeId}>
                          <h4>{item.noticeTitle}</h4>
                          <div className={classes['notice-content']} dangerouslySetInnerHTML={{ __html: item.noticeContent as string }} />
                        </div>
                      );
                    }
                  })
                ) : (
                  <Empty description="暂无公告" />
                )}
              </>
            ),
          },
        ]}
      />
    </div>
  );

  return (
    <Popover content={noticeDiv} trigger="click" open={open} onOpenChange={handleOpenChange}>
      <Badge dot={show}>
        <NotificationOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
      </Badge>
    </Popover>
  );
};

export default observer(NoticeCom);
