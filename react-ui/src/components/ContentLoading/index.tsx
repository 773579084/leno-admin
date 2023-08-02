import classes from './index.module.scss'
import { Spin } from 'antd'
/* mobx */
import { observer } from 'mobx-react-lite'
import useStore from '@/store'

const Loading = () => {
  const {
    useGlobalStore: { isContentLoading },
  } = useStore()

  return isContentLoading ? <Spin className={classes['global-loading']} size="large" /> : null
}

export default observer(Loading)
