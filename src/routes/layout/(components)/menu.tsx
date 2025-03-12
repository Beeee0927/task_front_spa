import { Menu as AntdMenu, MenuProps } from 'antd'
import { useMenuStore } from '@/store'
import { useEffect, useMemo } from 'react'
import { Link, useLocation } from '@modern-js/runtime/router'

export default function Menu() {
  const { pathname } = useLocation()

  type MenuItem = Required<MenuProps>['items'][number]
  const commonItems: (MenuItem & { key: string })[] = [
    {
      key: '/layout/message',
      get label() {
        return <Link to={this.key}>消息列表</Link>
      }
    },
    {
      key: '/layout/task',
      get label() {
        return <Link to={this.key}>任务列表</Link>
      }
    },
    {
      key: '/layout/user',
      get label() {
        return <Link to={this.key}>重置密码</Link>
      }
    }
  ]
  // const userItems: MenuItem[] = []
  // const adminItems: MenuItem[] = []
  const items: MenuItem[] = [...commonItems]

  const { activeKey, setActiveKey } = useMenuStore()
  const availableKeys = useMemo(() => items.map((item) => item?.key), [])
  useEffect(() => {
    if (availableKeys.includes(pathname)) setActiveKey(pathname)
  }, [pathname])

  return (
    <AntdMenu
      style={{
        width: 'calc(100px + 8vw)',
        flexShrink: 0,
        padding: '6px 4px',
        backgroundColor: '#00000001',
        boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.1)'
      }}
      selectedKeys={[activeKey]}
      mode="inline"
      items={items}
    />
  )
}
