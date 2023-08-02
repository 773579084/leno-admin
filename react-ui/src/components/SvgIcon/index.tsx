import { MouseEventHandler } from 'react'
import PropTypes from 'prop-types'
import classes from './index.module.scss'

const SvgIcon = (props: {
  iconClass: string
  svgClass: string
  style?: object
  fill: string
  click: MouseEventHandler<HTMLElement>
}) => {
  const { iconClass, fill, svgClass, style, click } = props

  return (
    <span className="anticon">
      <i aria-hidden="true" onClick={click} style={style} className={`${classes['icon-i']}`}>
        <svg className={`${classes['svg-class']} ${svgClass}`}>
          <use xlinkHref={'#icon-' + iconClass} fill={fill} />
        </svg>
      </i>
    </span>
  )
}

SvgIcon.propTypes = {
  // svg名字
  iconClass: PropTypes.string.isRequired,
  // 自定义类名
  svgClass: PropTypes.string,
  //自定义方法
  click: PropTypes.func,
  // 填充颜色
  fill: PropTypes.string,
  style: PropTypes.object,
}

SvgIcon.defaultProps = {
  fill: 'currentColor',
  svgClass: '',
  click: () => {},
}

export default SvgIcon
