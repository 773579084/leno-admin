import { Button, Card, Col, Collapse, Divider, Row } from 'antd';
import { GithubOutlined, GoogleOutlined, UserOutlined, SendOutlined } from '@ant-design/icons';
import classes from './index.module.scss';

const { Panel } = Collapse;

const Home = () => (
  <div className="app-container">
    <Row gutter={30}>
      <Col span={12}>
        <h1>Leno Admin 后台管理框架</h1>
        <p style={{ color: '#696c6e' }}>
          日常中，常借鉴于若依框架，发现它确实拥有很多优点；一次察觉若依似乎还未有支持前端React和后端nodejs的版本；故而突发奇想，便有了现在的Leno Admin；秉承着开源精神，Leno
          Admin代码文档将完全开源，给你的项目多一种参考与选择。
        </p>
        <p>
          <b>当前版本:</b> <span> v1.0.0</span>
        </p>
        <div>
          <Row gutter={[8, 16]}>
            <Col>
              <Button
                type="primary"
                ghost
                icon={<GoogleOutlined />}
                onClick={() => {
                  window.open('https://gitee.com/zhao-wenchao110/leno_-admin');
                }}
              >
                Gitee
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                ghost
                icon={<GithubOutlined />}
                onClick={() => {
                  window.open('https://github.com/773579084/Leno_Admin');
                }}
              >
                GitHub
              </Button>
            </Col>
          </Row>
        </div>
        <p style={{ marginTop: 15 }}>如果觉得不错，欢迎给一个⭐Star⭐,你的支持就是我继续免费更新下去的动力，谢谢~</p>
      </Col>
      <Col span={12}>
        <Row>
          <Col>
            <h1>技术选项</h1>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <h4>后端技术</h4>
            <ul>
              <li>Koa</li>
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

    <Row gutter={[30, 16]} className={classes.home}>
      <Col span={8}>
        <Card title="联系信息">
          <div>
            <SendOutlined /> 官网：
            <a href="http://zhao-wenchao110.gitee.io/lenoadmin-docs" target="_blank">
              http://zhao-wenchao110.gitee.io/lenoadmin-docs
            </a>
          </div>
          <div>
            <UserOutlined /> QQ群：913365274
          </div>
        </Card>
      </Col>
      <Col span={8}>
        <Card title="更新日志">
          <Collapse accordion bordered={false} ghost>
            <Panel header="v1.0.0 2023-08-22" key="1">
              <p>1、Leno Admin前后端分离系统正式发布</p>
            </Panel>
            <Panel header="v2.0.0 2023-09-22" key="2">
              <p>1、layout的切换动画新增模式</p>
              <p>2、修复在线用户偶尔获取数据报错</p>
              <p>3、重构了前后端项目的eslint和stylelintrc</p>
              <p>4、重构了项目目录结构</p>
              <p>5、包管理由npm替换为了yarn</p>
              <p>6、包管理由npm替换为了yarn</p>
              <p>7、改变了tabs的展示模式</p>
              <p>8、修复了ip查询出错导致无法登录的问题</p>
              <p>9、在线用户页面，切换页码，返回的数据不正确</p>
              <p>10、新增了管控接口短时间内的重复提交，可以自行选择是否开启</p>
              <p>11、其他细节</p>
            </Panel>
          </Collapse>
        </Card>
      </Col>
      <Col span={8}>
        <Card title="其他模块">
          {/* <div className={classes['image']} /> */}
          {/* <p style={{ marginTop: 15 }}>你可以请作者喝杯咖啡表示鼓励</p> */}
        </Card>
      </Col>
    </Row>
  </div>
);
export default Home;
