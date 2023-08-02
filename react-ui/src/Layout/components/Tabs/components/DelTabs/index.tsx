import { Button, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import classes from './index.module.scss'
import { CloseOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'

const DelTabs = (props: any) => {
  const { pathname } = useLocation()

  // 下拉菜单
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div onClick={(e) => props.delTabFn(e, pathname)}>
          <CloseOutlined style={{ marginRight: 10 }} />
          关闭当前
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={(e) => props.delTabFn(e, pathname, 'otherAll')}>
          <CloseCircleOutlined style={{ marginRight: 10 }} />
          关闭其他
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div onClick={(e) => props.delTabFn(e, pathname, 'all')}>
          <CloseCircleOutlined style={{ marginRight: 10 }} />
          关闭全部
        </div>
      ),
    },
  ]

  return (
    <div className={classes['tabs-del-tabs']}>
      <Dropdown menu={{ items }} placement="bottomRight" arrow>
        <Button size="middle" type="primary">
          更多
        </Button>
      </Dropdown>
    </div>
  )
}

export default DelTabs
