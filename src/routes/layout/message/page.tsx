import { Badge, Button, List, Modal, Tabs, TabsProps } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { api_getMessages, api_readAllMessage, api_readMessage } from './api'
import { Link } from '@modern-js/runtime/router'

export default function Message() {
  const [data, setData] = useState<any[]>([])

  const [tabKey, setTabKey] = useState('0')
  useEffect(() => {
    setData([])
    api_getMessages({ read: tabKey === '1' }).then((res: any) => {
      setData(res.data)
    })
  }, [tabKey])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modelTitle, setModelTitle] = useState('')
  const [modelContent, setModelContent] = useState('' as any)

  const DetailLink = useCallback(
    ({
      modelTitle,
      modelContent,
      content,
      messageId
    }: {
      modelTitle: string
      modelContent: any
      content: string
      messageId: number
    }) => {
      return (
        <Link
          key="list-loadmore-more"
          to=""
          onClick={() => {
            setModelTitle(modelTitle)
            setModelContent(modelContent)
            setIsModalOpen(true)
            setData(
              data.map((item: any) => {
                if (item._id === messageId) return { ...item, read: true }
                return item
              })
            )
            api_readMessage({ messageId })
          }}
        >
          {content}
        </Link>
      )
    },
    [data]
  )

  const items: TabsProps['items'] = [
    {
      key: '0',
      label: '未读消息'
    },
    {
      key: '1',
      label: '已读消息'
    }
  ]

  const handleReadAll = () => {
    api_readAllMessage()
    setData(data.map((item: any) => ({ ...item, read: true })))
  }

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <Tabs items={items} activeKey={tabKey} onChange={setTabKey} />
        <Button type="primary" onClick={handleReadAll} className="mt-4">
          全部已读
        </Button>
      </div>

      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={({ _id, title, content, time, read }, index) => (
          <List.Item
            actions={[
              <DetailLink
                modelTitle={title}
                modelContent={content}
                content="详情"
                messageId={_id}
              />
            ]}
            style={{ display: 'flex' }}
          >
            <List.Item.Meta
              title={
                <Badge dot offset={[2, 0]} count={+!read}>
                  <DetailLink
                    modelTitle={title}
                    modelContent={content}
                    content={title}
                    messageId={_id}
                  />
                </Badge>
              }
              description={content}
            />
            <div>
              {(() => {
                const difSeconds = Math.floor(
                  (Date.now() - new Date(time).getTime()) / 1000
                )
                const difMinutes = Math.floor(difSeconds / 60)
                const difHours = Math.floor(difMinutes / 60)
                const difDays = Math.floor(difHours / 24)
                const difWeeks = Math.floor(difDays / 7)
                const difMonths = Math.floor(difDays / 30)
                const difYears = Math.floor(difDays / 365)
                if (!difMinutes) return '刚刚'
                if (!difHours) return difMinutes + '分钟前'
                if (!difDays) return difHours + '小时前'
                if (!difWeeks) return difDays + '天前'
                if (!difMonths) return difWeeks + '周前'
                if (!difYears) return difMonths + '月前'
                return difYears + '年前'
              })()}
            </div>
          </List.Item>
        )}
      />
      <Modal
        title={modelTitle}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        style={{ top: '30%' }}
      >
        {modelContent}
      </Modal>
    </div>
  )
}
