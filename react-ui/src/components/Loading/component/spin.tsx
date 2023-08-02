import React, { useState } from 'react'
import classes from './spin.module.scss'
import { ILoadingGloBalPropsType } from '@/type'

const Spin: React.FC<ILoadingGloBalPropsType> = ({ className, delay, tip }) => {
  const [isShow, setIsShow] = useState(false)
  setTimeout(() => {
    setIsShow(true)
  }, delay)

  return isShow ? (
    <div className={classes['loading-global'] + ` ${className}`}>
      <div className={classes.ring1}>
        <div className={classes.ring2}></div>
        <div className={classes.ring3}></div>
        <div className={classes.dot}></div>
      </div>
      {tip ? <div className={classes['laoding-font']}>{tip}</div> : null}
    </div>
  ) : null
}
export default Spin
