import { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import { FileTextOutlined, DesktopOutlined, MacCommandOutlined } from '@ant-design/icons';
import SvgIcon from '@/components/SvgIcon';
import { getListAPI } from '@/api/modules/monitor/server';
import { IserverType } from '@/type/modules/monitor/server';
import useStore from '@/store';
import classes from './index.module.scss';

const Server = () => {
  const [info, setInfo] = useState<IserverType>();
  const {
    useGlobalStore: { changeIsContentLoading },
  } = useStore();

  useEffect(() => {
    changeIsContentLoading(true);
    async function init() {
      try {
        const {
          data: { result },
        } = await getListAPI();
        setInfo(result);
        changeIsContentLoading(false);
      } catch (error) {
        changeIsContentLoading(false);
      }
    }
    init();
  }, []);

  return (
    <div className="app-container">
      <div className={classes['site-layout-background']}>
        <Row gutter={24}>
          <Col span={12}>
            <Card
              title={
                <div>
                  <SvgIcon iconClass="cpu" style={{ fontSize: '20px' }}></SvgIcon> CPU
                </div>
              }
            >
              <Row gutter={24} className="header">
                <Col span={12}>
                  <div className="cell">属性</div>
                </Col>
                <Col span={12}>
                  <div className="cell">值</div>
                </Col>
              </Row>
              <Row gutter={24} className="body">
                <Col span={12}>
                  <div className="cell">核心数</div>
                </Col>
                <Col span={12}>
                  <div className="cell">{info?.cpu.cpuNum}</div>
                </Col>
              </Row>
              <Row gutter={24} className="body">
                <Col span={12}>
                  <div className="cell">用户使用率</div>
                </Col>
                <Col span={12}>
                  <div className="cell">{info?.cpu.used} %</div>
                </Col>
              </Row>
              <Row gutter={24} className="body">
                <Col span={12}>
                  <div className="cell">系统使用率</div>
                </Col>
                <Col span={12}>
                  <div className="cell">{info?.cpu.sys} %</div>
                </Col>
              </Row>
              <Row gutter={24} className="body">
                <Col span={12}>
                  <div className="cell">当前空闲率</div>
                </Col>
                <Col span={12}>
                  <div className="cell">{info?.cpu.free as number} %</div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title={
                <div>
                  <FileTextOutlined /> 内存
                </div>
              }
            >
              <Row gutter={24} className="header">
                <Col span={12}>
                  <div className="cell">属性</div>
                </Col>
                <Col span={12}>
                  <div className="cell">内存</div>
                </Col>
              </Row>
              <Row gutter={24} className="body">
                <Col span={12}>
                  <div className="cell">总内存</div>
                </Col>
                <Col span={12}>
                  <div className="cell">{info?.mem.total} G</div>
                </Col>
              </Row>
              <Row gutter={24} className="body">
                <Col span={12}>
                  <div className="cell">已用内存</div>
                </Col>
                <Col span={12}>
                  <div className="cell">{info?.mem.used} G</div>
                </Col>
              </Row>
              <Row gutter={24} className="body">
                <Col span={12}>
                  <div className="cell">剩余内存</div>
                </Col>
                <Col span={12}>
                  <div className="cell">{info?.mem.free} G</div>
                </Col>
              </Row>
              <Row gutter={24} className="body">
                <Col span={12}>
                  <div className="cell">使用率</div>
                </Col>
                <Col span={12}>
                  <div className="cell">{info?.mem.usage} %</div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 20 }}>
          <Col span={24}>
            <Card
              title={
                <div>
                  <DesktopOutlined /> 服务器信息
                </div>
              }
            >
              <Row gutter={24} className="body">
                <Col span={5}>
                  <div className="cell">服务器名称</div>
                </Col>
                <Col span={7}>
                  <div className="cell">{info?.sys.computerName}</div>
                </Col>
                <Col span={5}>
                  <div className="cell">操作系统</div>
                </Col>
                <Col span={7}>
                  <div className="cell">{info?.sys.osName}</div>
                </Col>
              </Row>
              <Row gutter={24} className="body">
                <Col span={5}>
                  <div className="cell">服务器IP</div>
                </Col>
                <Col span={7}>
                  <div className="cell">{info?.sys.computerIp}</div>
                </Col>
                <Col span={5}>
                  <div className="cell">系统架构</div>
                </Col>
                <Col span={7}>
                  <div className="cell">{info?.sys.osArch}</div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 20 }}>
          <Col span={24}>
            <Card
              title={
                <div>
                  <MacCommandOutlined /> 磁盘状态
                </div>
              }
            >
              <Row gutter={24} className="header">
                <Col span={3}>
                  <div className="cell">盘符路径</div>
                </Col>
                <Col span={3}>
                  <div className="cell">序列号</div>
                </Col>
                <Col span={5}>
                  <div className="cell">盘符描述</div>
                </Col>
                <Col span={3}>
                  <div className="cell">总大小</div>
                </Col>
                <Col span={3}>
                  <div className="cell">可用大小</div>
                </Col>
                <Col span={3}>
                  <div className="cell">已用大小</div>
                </Col>
                <Col span={3}>
                  <div className="cell">已用百分比</div>
                </Col>
              </Row>
              {info?.sysFiles.map((file, index) => (
                <Row gutter={24} className="body" key={index}>
                  <Col span={3}>
                    <div className="cell">{file.dirName}</div>
                  </Col>
                  <Col span={3}>
                    <div className="cell">{file.sysTypeName}</div>
                  </Col>
                  <Col span={5}>
                    <div className="cell">{file.typeName}</div>
                  </Col>
                  <Col span={3}>
                    <div className="cell">{file.total} GB</div>
                  </Col>
                  <Col span={3}>
                    <div className="cell">{file.free} GB</div>
                  </Col>
                  <Col span={3}>
                    <div className="cell">{file.used} GB</div>
                  </Col>
                  <Col span={3}>
                    <div className="cell">{file.usage} %</div>
                  </Col>
                </Row>
              ))}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Server;
