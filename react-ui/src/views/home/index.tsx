import { Button, Card, Col, Collapse, Divider, Row } from 'antd'
import { GithubOutlined, GoogleOutlined, UserOutlined, SendOutlined } from '@ant-design/icons'
import classes from './index.module.scss'

const { Panel } = Collapse

const Home = () => {
  return (
    <div className="app-container">
      <Row gutter={[50, 16]}>
        <Col span={12}>
          <h1>Leno Admin 后台管理框架</h1>
          <p style={{ color: '#696c6e' }}>
            日常开发中，经常借鉴若依框架，觉得它确实有很多优点；有一次看到若依中似乎还未有支持前端React和后端nodejs的版本，故而突发奇想，便有了现在Leno
            Admin；秉承着开源精神，Leno Admin代码文档将完全开源，给你的项目多一种参考与选择。
          </p>
          <p>
            <b>当前版本:</b> <span> v1.0.0</span>
          </p>
          <p>
            <Row gutter={[8, 16]}>
              <Col>
                <Button
                  type="primary"
                  ghost
                  icon={<GoogleOutlined />}
                  onClick={() => {
                    window.open('https://gitee.com/zhao-wenchao110/leno_-admin')
                  }}
                >
                  Gitee
                </Button>
              </Col>
              <Col>
                <Button type="primary" ghost icon={<GithubOutlined />}>
                  GitHub
                </Button>
              </Col>
            </Row>
          </p>
          <p>如果觉得不错，欢迎给一个⭐Star⭐,你的支持就是我继续免费更新下去的动力，谢谢~</p>
        </Col>
        <Col span={12}>
          <Row>
            <Col>
              ``
              <h1>技术选项</h1>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <h4>后端技术</h4>
              <ul>
                <li>Koa2</li>
                <li>sequelize</li>
                <li>socket.io</li>
                <li>typescript</li>
                <li>exceljs</li>
                <li>joi</li>
                <li>...</li>
              </ul>
            </Col>
            <Col span={6}>
              <h4>前端技术</h4>
              <ul>
                <li>React Hooks</li>
                <li>mobx</li>
                <li>webpacke5</li>
                <li>typescript</li>
                <li>antd</li>
                <li>axios</li>
                <li>...</li>
              </ul>
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider />

      <Row gutter={[30, 16]} className={classes['home']}>
        <Col span={8}>
          <Card title="联系信息">
            <p>
              <SendOutlined /> 官网：<a></a>
            </p>
            <p>
              <UserOutlined /> QQ群：913365274
            </p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="更新日志">
            <Collapse accordion bordered={false} ghost>
              <Panel header="v1.0.0 2023-08-22" key="1">
                <p>1、Leno Admin前后端分离系统正式发布</p>
              </Panel>
            </Collapse>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="捐赠支持">
            <div className={classes['image']} />
            <p style={{ marginTop: 15 }}>你可以请作者喝杯咖啡表示鼓励</p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
export default Home
