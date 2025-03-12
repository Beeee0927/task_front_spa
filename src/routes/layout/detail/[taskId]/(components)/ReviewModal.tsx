import { Button, Input, InputNumber, message, Modal } from 'antd'
import { useState } from 'react'
import { api_addReview } from '../api'
import { useParams } from '@modern-js/runtime/router'

export default function ReviewModal({
  userId,
  isModalOpen,
  setIsModalOpen,
  refresh,
  setReviewEvent
}: any) {
  const [score, setScore] = useState(0)
  const [comment, setComment] = useState('')
  const taskId = useParams().taskId as string
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    api_addReview({
      userId,
      taskId,
      score,
      comment
    }).then((res) => {
      message.success(res.message)
      console.log(res)
      setIsModalOpen(false)
      setLoading(false)
      refresh(userId)
      setReviewEvent((x: number) => x + 1)
    })
  }

  return (
    <Modal
      title="批阅作答"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      style={{ top: '30%' }}
    >
      <div>
        <div className="text-sm mb-2 mt-2">成绩：</div>
        <InputNumber
          min={1}
          max={100}
          defaultValue={0}
          value={score}
          onChange={(value) => setScore(value ?? 0)}
        />
        <div className="text-sm mb-2 mt-2">评价：</div>
        <Input.TextArea
          autoSize={{ minRows: 4 }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          type="primary"
          size="large"
          className="w-full mt-4"
          onClick={handleSubmit}
          loading={loading}
        >
          提交批阅
        </Button>
      </div>
    </Modal>
  )
}
