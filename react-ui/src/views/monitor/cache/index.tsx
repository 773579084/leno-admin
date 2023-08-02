import { useEffect, useState } from 'react'
import classes from './index.module.scss'
import { Card, Row, Col } from 'antd'
import { DashboardOutlined, DesktopOutlined, PieChartOutlined } from '@ant-design/icons'
import { getCacheMonitorAPI } from '@/api/modules/monitor/cache'
import useStore from '@/store'
import Pie from './components/Pie'
import TableDisc from './components/TableDisc'
import { ICacheMonitoType, Info } from '@/type/modules/monitor/cache'

const Cache = () => {
  const [info, setInfo] = useState<ICacheMonitoType>()
  const {
    useGlobalStore: { changeIsContentLoading },
  } = useStore()

  useEffect(() => {
    changeIsContentLoading(true)
    async function init() {
      try {
        const {
          data: { result },
        } = await getCacheMonitorAPI()

        setInfo(result)
        changeIsContentLoading(false)
      } catch (error) {
        console.error(error)
        changeIsContentLoading(false)
      }
    }
    init()
  }, [])

  return (
    <div className="app-container">
      <div className={classes['site-layout-background']}>
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title={
                <div>
                  <DesktopOutlined /> 基本信息
                </div>
              }
            >
              <Row gutter={24} className="body">
                <Col span={3}>
                  <div className="cell">Redis版本</div>
                </Col>
                <Col span={3}>
                  <div className="cell">{info?.info.version}</div>
                </Col>
                <Col span={3}>
                  <div className="cell">运行模式</div>
                </Col>
                <Col span={3}>
                  <div className="cell">{info?.info.version}</div>
                </Col>
                <Col span={3}>
                  <div className="cell">端口</div>
                </Col>
                <Col span={3}>
                  <div className="cell">{info?.info.port}</div>
                </Col>
                <Col span={3}>
                  <div className="cell">客户端数</div>
                </Col>
                <Col span={3}>
                  <div className="cell">{info?.info.client}</div>
                </Col>
              </Row>
              <Row gutter={24} className="body">
                <Col span={3}>
                  <div className="cell">运行时间(天)</div>
                </Col>
                <Col span={3}>
                  <div className="cell">{info?.info.day}</div>
                </Col>
                <Col span={3}>
                  <div className="cell">使用内存</div>
                </Col>
                <Col span={3}>
                  <div className="cell">{info?.info.memoryShow}</div>
                </Col>
                <Col span={3}>
                  <div className="cell">使用CPU</div>
                </Col>
                <Col span={3}>
                  <div className="cell">{Number(info?.info.cpu).toFixed(2)}</div>
                </Col>
                <Col span={3}>
                  <div className="cell">内存消耗峰值</div>
                </Col>
                <Col span={3}>
                  <div className="cell">{info?.info.memoryTotal}</div>
                </Col>
              </Row>
              <Row gutter={24} className="body">
                <Col span={3}>
                  <div className="cell">AOF是否开启</div>
                </Col>
                <Col span={3}>
                  <div className="cell">{info?.info.aof === '0' ? '关闭' : '开启'}</div>
                </Col>
                <Col span={3}>
                  <div className="cell">RDB是否成功</div>
                </Col>
                <Col span={3}>
                  <div className="cell">{info?.info.rdb}</div>
                </Col>
                <Col span={3}>
                  <div className="cell">Key数量</div>
                </Col>
                <Col span={3}>
                  <div className="cell">{info?.info.keys.keys}</div>
                </Col>
                <Col span={3}>
                  <div className="cell">网络入口/出口</div>
                </Col>
                <Col span={3}>
                  <div className="cell">
                    {info?.info.ipEnter}kps/{info?.info.ipOut}kps
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 20 }}>
          <Col span={12}>
            <Card
              title={
                <div>
                  <PieChartOutlined /> 命令统计
                </div>
              }
            >
              <div className={classes['echarts']}>
                {info?.commandStats ? <Pie data={info.commandStats} /> : ''}
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title={
                <div>
                  <DashboardOutlined /> 内存信息
                </div>
              }
            >
              <div className={classes['echarts']}>
                {info?.info ? <TableDisc data={info?.info as Info} /> : ''}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Cache
