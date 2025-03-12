import { useEffect, useRef, useState } from 'react'
import 'quill/dist/quill.snow.css'
import './page.scss'
import { Button, Input, DatePicker, message, Modal } from 'antd'
import { useLocalStore } from '@/store'
import { api_addTask, api_updateTask } from './api'
import { api_getTaskDetail } from '../../task/api'
import dayjs, { Dayjs } from 'dayjs'
import { useNavigate, useParams } from '@modern-js/runtime/router'

export default function Edit() {
  const [deadline, setDeadline] = useState<Dayjs | string | null>(null)
  const [title, setTitle] = useState('')
  const quill = useRef<any>(null)
  const { deptName } = useLocalStore()
  const navigate = useNavigate()
  const { id } = useParams()
  const editing = id !== '-1'

  useEffect(() => {
    ;(async () => {
      const Quill = await (await import('quill')).default

      quill.current = new Quill('#editor', { theme: 'snow' })

      if (editing) {
        api_getTaskDetail({ id }).then((res: any) => {
          setTitle(res.data.title)
          setDeadline(res.data.deadline)
          quill.current.setContents(res.data.content)
        })
      }
    })()
  }, [])

  function handleSubmit() {
    if (!title || !deadline || !quill.current.getContents())
      return message.error('请填写完整信息')

    Modal.confirm({
      title: editing ? '修改任务' : '添加任务',
      content: editing ? '确认提交修改吗' : '确认添加任务吗',
      onOk: () => {
        ;(editing ? api_updateTask : api_addTask)({
          title,
          deadline,
          content: quill.current.getContents(),
          contentHtml: quill.current.getSemanticHTML(),
          deptName,
          id
        }).then((res: any) => {
          message.success(res.message)
          navigate('/layout/task')
        })
      },
      icon: null,
      style: { top: '30%' }
    })
  }

  return (
    <div className="py-4">
      <div className="w-full justify-between mb-4 flex items-center">
        <Input
          value={title}
          placeholder="请输入任务标题"
          size="large"
          className="flex-grow"
          style={{ marginRight: '16px' }}
          onChange={(e) => setTitle(e.target.value)}
        />
        <DatePicker
          value={deadline && dayjs(deadline)}
          size="large"
          className="w-80"
          placeholder="请选择截止日期"
          style={{ marginRight: '16px' }}
          onChange={(v: any) => setDeadline(v.$d)}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
        />
        <Button
          type="primary"
          size="large"
          className="w-40"
          onClick={handleSubmit}
        >
          提交
        </Button>
      </div>
      <div id="editor"></div>
    </div>
  )
}
