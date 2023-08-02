import classes from './index.module.scss'
import Spin from './component/spin'
/* mobx */
import { observer } from 'mobx-react-lite'
import useStore from '@/store'

const Loading = () => {
  const { useGlobalStore } = useStore()

  return useGlobalStore.isLoading ? (
    <Spin
      delay={useGlobalStore.globalLoadingTimeMobx}
      tip="Loading..."
      className={classes['global-loading']}
    />
  ) : null
}

export default observer(Loading)
