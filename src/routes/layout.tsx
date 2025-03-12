import RouteInterceptor from '@/utils/routeIntereceptor'
import './globals.scss'
import { Outlet } from '@modern-js/runtime/router'

export default function RootLayout() {
  return (
    <div className="h-screen">
      <RouteInterceptor />
      <Outlet />
    </div>
  )
}
