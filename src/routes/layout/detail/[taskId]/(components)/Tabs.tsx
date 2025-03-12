import { useEffect, useRef, useState } from 'react'
import { api_getTaskBadges, api_getUsers } from '../api'
import { useLocalStore } from '@/store'
import { Tabs as AntdTabs, Badge } from 'antd'
import { useParams } from '@modern-js/runtime/router'

export default function Tabs({ refresh, reviewEvent }: any) {
  const { role } = useLocalStore()
  const isAdmin = role === 'admin'
  const { taskId } = useParams()

  const [items, setItems] = useState<any[]>([])

  const [ansState, setAnsState] = useState<any>([])

  if (isAdmin) {
    useEffect(() => {
      api_getTaskBadges({ taskId }).then((res) => {
        setAnsState(res.data as any[])
      })
    }, [reviewEvent])

    useEffect(() => {
      api_getUsers().then((res: any) => {
        setItems(
          [{ label: '仅题目', key: '' }].concat(
            res.data.map(({ username, _id }: any) => ({
              label: (() => {
                const { grading = [], finished = [] } = ansState
                const concatedArr = grading.concat(finished)
                return (
                  <Badge
                    dot
                    color={grading.includes(_id) ? 'red' : 'green'}
                    count={+concatedArr.includes(_id)}
                    offset={[2, 0]}
                  >
                    {username}
                  </Badge>
                )
              })(),
              key: _id
            }))
          )
        )
      })
    }, [ansState])
  }

  const [activeKey, setActiveKey] = useState('')
  const lastActiveKey = useRef('')

  return (
    <>
      {isAdmin && (
        <AntdTabs
          items={items}
          style={{ marginBottom: '20px' }}
          onChange={(key) => {
            refresh(key).then((res: any) => {
              if (res.code === 1) setActiveKey(lastActiveKey.current)
            })
            lastActiveKey.current = activeKey
            setActiveKey(key)
          }}
          activeKey={activeKey}
        />
      )}
    </>
  )
}
