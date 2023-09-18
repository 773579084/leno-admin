import React, { useEffect, useState } from 'react';
import icons from '@/assets/icons';
import { Col, Input, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import SvgIcon from '../SvgIcon';

export type IconsSelectProps = {
  onSubmit: (icon: string, open: boolean) => void;
};

const IconSelect: React.FC<IconsSelectProps> = (props) => {
  const { onSubmit } = props;
  const [newIcons, setNewIcons] = useState<string[]>([]);

  const initIcons = () => {
    const iconList = icons.filter((icon) => icon !== 'login_bg');
    setNewIcons(iconList);
  };
  useEffect(() => {
    initIcons();
  }, []);

  const filterIcons = (name?: string) => {
    const iconList = icons.filter((icon) => icon.indexOf(name) !== -1);
    setNewIcons(iconList);
  };

  return (
    <Row style={{ width: 500, height: 160, overflow: 'auto' }}>
      <Input
        onChange={(e) => {
          e.target.value ? filterIcons(e.target.value) : initIcons();
        }}
        allowClear
        prefix={<SearchOutlined />}
        placeholder="请输入图表名称"
        style={{ margin: '0 10px 10px 0', height: 32 }}
      />
      {newIcons.map((icon) => (
        <Col
          span={8}
          key={icon}
          onClick={() => {
            onSubmit(icon, false);
          }}
        >
          <Row align="middle" style={{ cursor: 'pointer' }}>
            <SvgIcon iconClass={icon}></SvgIcon>
            <span style={{ marginLeft: 5 }}>{icon}</span>
          </Row>
        </Col>
      ))}
    </Row>
  );
};

export default IconSelect;
