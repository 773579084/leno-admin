import { useState, useEffect } from 'react';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { message } from 'antd';
import screenfull from 'screenfull';

const ScreenFull = () => {
  const [isScreenFull, setIsScreenFull] = useState<boolean>(screenfull.isFullscreen);
  // screenfull.isFullscreen 监听浏览器是否全屏 false不是全屏反之

  useEffect(() => {
    screenfull.on('change', () => {
      if (screenfull.isFullscreen) setIsScreenFull(true);
      else setIsScreenFull(false);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => screenfull.off('change', () => {});
    });
  }, []);

  const changeIsScreenFullFn = () => {
    if (!screenfull.isEnabled) message.warning('当前您的浏览器不支持全屏!');
    screenfull.toggle();
  };

  return !isScreenFull ? (
    <FullscreenOutlined style={{ float: 'right', fontSize: 18 }} onClick={changeIsScreenFullFn} />
  ) : (
    <FullscreenExitOutlined style={{ float: 'right', fontSize: 18 }} onClick={changeIsScreenFullFn} />
  );
};

export default ScreenFull;
