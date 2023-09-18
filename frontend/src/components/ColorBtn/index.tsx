import React from 'react';
import { Button, ButtonProps } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import classNames from 'classnames';
import classes from './index.module.scss';

export interface ButtonPropType {
  color?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}
const ColorBtn: React.FC<ButtonProps & ButtonPropType> = (props) => {
  // prefixCls 完全重写覆盖ant button
  const { disabled, children, color } = props;

  const styleClass = classNames({
    [classes['color-primary-normal']]: color === 'primary' && !disabled,
    [classes['color-primary-disabled']]: color === 'primary' && disabled,
    [classes['color-success-normal']]: color === 'success' && !disabled,
    [classes['color-success-disabled']]: color === 'success' && disabled,
    [classes['color-danger-normal']]: color === 'danger' && !disabled,
    [classes['color-danger-disabled']]: color === 'danger' && disabled,
    [classes['color-info-normal']]: color === 'info' && !disabled,
    [classes['color-info-disabled']]: color === 'info' && disabled,
    [classes['color-warning-normal']]: color === 'warning' && !disabled,
    [classes['color-warning-disabled']]: color === 'warning' && disabled,
  });

  return (
    <span className={styleClass}>
      <Button {...props}>{children}</Button>
    </span>
  );
};

ColorBtn.defaultProps = {
  color: 'primary', // 'primary' | 'success' | 'info' | 'warning' | 'danger'
};

export default ColorBtn;
