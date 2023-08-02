import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { HOME_URL } from '@/config/config'

const NotNetwork = () => {
  const navigate = useNavigate()
  return (
    <div className="app-container">
      <Result
        status="500"
        title="500"
        subTitle="不好意思, 您的网络可能出现了问题。"
        extra={
          <Button type="primary" onClick={() => navigate(HOME_URL)}>
            返回首页
          </Button>
        }
      />
    </div>
  )
}
export default NotNetwork
