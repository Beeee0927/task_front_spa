import { Avatar, Image } from 'antd'
import Menu from './(components)/menu'
import { Outlet } from '@modern-js/runtime/router'
import { UserOutlined } from '@ant-design/icons'
import { useNavigate } from '@modern-js/runtime/router'

export default function RootLayout() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between pl-6 pr-4 shadow-md z-[100] relative items-center">
        <div className="flex items-center gap-6">
          <Image src="/logo.png" width={60} height={60} preview={false} />
          翼灵任务系统
        </div>
        <Avatar
          size={32}
          icon={<UserOutlined />}
          className="cursor-pointer"
          onClick={() => {
            navigate('/login')
          }}
        />
      </div>
      <div className="flex flex-grow overflow-y-hidden">
        <Menu />
        <div className="px-12 pt-6 flex-grow overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
