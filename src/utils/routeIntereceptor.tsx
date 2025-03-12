// import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useLocalStore, useRouterStore } from '../store'
import { useLocation, useNavigate, useParams } from '@modern-js/runtime/router'

export default function RouteInterceptor() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { sessionId } = useLocalStore()

  useEffect(() => {
    if (!sessionId) {
      if (pathname !== '/login') navigate('/login')
    } else if (['/', '/layout'].includes(pathname)) navigate('/layout/message')
  }, [pathname])

  const key = useRouterStore((state: any) => state.key)
  useEffect(() => {
    if (key > 0) navigate('/login')
  }, [key])

  return null
}
