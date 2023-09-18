import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

const LoginConfirm = () => {
  const navigate = useNavigate();

  confirm({
    title: '系统提示',
    content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
    cancelText: '取消',
    okText: '重新登录',
    onOk: () => {
      navigate('/login');
    },
  });
};

export default LoginConfirm;
