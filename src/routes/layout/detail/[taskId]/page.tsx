import { useEffect, useRef, useState } from 'react'
import { Button, message, Modal, Progress, ProgressProps, Tooltip } from 'antd'
import { useLocalStore } from '@/store'
import { useNavigate, useParams } from '@modern-js/runtime/router'
import { api_getTaskDetail } from '../../task/api'
import dayjs from 'dayjs'
import 'quill/dist/quill.snow.css'
import './page.scss'
import { api_addAns, api_getAns } from './api'
import { downloadFiles } from '@/routes/api'
import Tabs from './(components)/Tabs'
import Files from './(components)/Files'
import UploadModal from './(components)/UploadModal'
import ReviewModal from './(components)/ReviewModal'
import { useImmer } from 'use-immer'
import Quill from 'quill'

export default function Detail() {
  const navigate = useNavigate()
  const taskId = useParams().taskId as string
  const { role } = useLocalStore()

  const [{ deadline, title, content, contentHtml }, setTaskData] =
    useImmer<any>({})
  const quill = useRef<any>(null)
  useEffect(() => {
    quill.current = new Quill('#editor', { theme: 'snow' })
  }, [])

  const [ansData, setAnsData] = useImmer<any>({})
  const { status, score, files, comment, curUserId } = ansData

  async function refresh(userId?: string) {
    setAnsData({
      status: undefined,
      score: -1,
      files: [],
      comment: '',
      curUserId: userId ?? ''
    })

    if (!userId) {
      quill.current.setContents(content)
      if (role === 'admin') quill.current.disable()
      return { code: 0 }
    }

    const res = api_getAns({ taskId, userId })
    res.then(async (res) => {
      if (res.code === 1) {
        if (role === 'admin') {
          setAnsData(ansData)
          message.error(res.message)
        }
        return
      }

      const {
        content,
        status: newStatus,
        files: newFiles,
        score: newScore,
        comment: newComment
      } = res.data

      quill.current.setContents(content)
      if (role === 'admin') quill.current.disable()
      // downloadFiles(newFiles).then(setFiles)
      setAnsData((draft: any) => {
        draft.status = newStatus
        draft.files = newFiles
        draft.score = newScore
        draft.comment = newComment
      })
      downloadFiles(newFiles).then((files) =>
        setAnsData((draft: any) => {
          draft.files = files
        })
      )
    })
    return res
  }

  const { userId } = useLocalStore()
  useEffect(() => {
    if (role === 'user') refresh(userId)
  }, [role])

  useEffect(() => {
    ;(async () => {
      api_getTaskDetail({ id: taskId }).then((res: any) => {
        const { title, deadline, contentHtml } = res.data
        setTaskData({ deadline, title, contentHtml })
      })

      if (role === 'user') refresh()
    })()
  }, [])

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  async function handleSubmit() {
    const data = {
      taskId,
      content: quill.current.getContents(),
      contentHtml: quill.current.getSemanticHTML(),
      files
    }
    if (quill.current.getSemanticHTML().length <= 7)
      return message.error('请先填写答案')

    Modal.confirm({
      title: '提交作答',
      content: '确定要提交吗',
      onOk: () => {
        api_addAns(data).then((res: any) => {
          message.success(res.message)
          navigate('/layout/task')
        })
      },
      icon: null,
      style: { top: '30%' }
    })
  }

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  const conicColors: ProgressProps['strokeColor'] = {
    '0%': '#108ee9',
    '75%': '#87d068',
    '100%': '#108ee9'
  }

  const [reviewEvent, setReviewEvent] = useState(0)

  return (
    <div>
      <Tabs refresh={refresh} reviewEvent={reviewEvent} />
      <div className="w-fit mx-auto min-w-[800px] bg-blue-50 p-10 rounded-md">
        <div className="flex justify-between">
          <div className="text-4xl font-bold mb-4 w-fit">{title}</div>
          <Tooltip
            title={comment ? '评语：' + comment : ''}
            placement="left"
            defaultOpen
            color="cyan"
          >
            <Progress
              type="circle"
              percent={score}
              size={75}
              strokeColor={conicColors}
              style={{
                transform: 'translateY(-20px)',
                visibility: score >= 0 ? 'visible' : 'hidden',
                cursor: 'pointer'
              }}
              format={(e) => e + '分'}
            />
          </Tooltip>
        </div>
        <div className="mb-4 flex flex-row-reverse">
          <div className="text-sm mb-4 w-fit flex">
            截止时间：{dayjs(deadline).format('YYYY-MM-DD HH:mm')}
          </div>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: contentHtml }}
          className="w-fit mb-10"
        />
        <div id="editor"></div>

        <Files
          setIsModalOpen={setIsUploadModalOpen}
          files={files}
          setFiles={(files: any) =>
            setAnsData((draft: any) => {
              draft.files = files
            })
          }
        />

        {
          <div>
            {role === 'user' && (
              <Button
                type="primary"
                size="large"
                className="w-full mt-6"
                onClick={handleSubmit}
              >
                {status === 'grading' ? '修改作答' : '提交作答'}
              </Button>
            )}
            {role === 'admin' && curUserId && (
              <Button
                type="primary"
                size="large"
                className="w-full mt-6"
                onClick={() => setIsReviewModalOpen(true)}
              >
                批阅作答
              </Button>
            )}
          </div>
        }
      </div>

      <UploadModal
        isModalOpen={isUploadModalOpen}
        setIsModalOpen={setIsUploadModalOpen}
        files={files}
        setFiles={(files: any) =>
          setAnsData((draft: any) => {
            draft.files = files
          })
        }
      />
      <ReviewModal
        userId={curUserId}
        isModalOpen={isReviewModalOpen}
        setIsModalOpen={setIsReviewModalOpen}
        refresh={refresh}
        setReviewEvent={setReviewEvent}
      />
    </div>
  )
}
