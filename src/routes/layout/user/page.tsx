import { Button, Form, Input, message, Modal } from 'antd'
import { useImmer } from 'use-immer'
import { api_resetPassword } from './api'

export default function User() {
  const [password, setPassword] = useImmer('')
  const [confirmPassword, setConfirmPassword] = useImmer('')

  const onFinish = () => {
    Modal.confirm({
      title: '重置密码',
      content: '确认重置密码吗',
      onOk: () => {
        return api_resetPassword({ password }).then((res) => {
          message.success(res.message)
        })
      },
      icon: null,
      style: { top: '30%' }
    })
  }

  return (
    <div className="mt-4">
      <Form
        layout="vertical"
        className="w-[360px]"
        onFinish={onFinish}
        size="large"
      >
        <Form.Item
          label="新密码"
          name="新密码"
          rules={[{ required: true, message: '请输入新密码' }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="确认密码"
          rules={[
            { required: true, message: '请重复新密码' },
            {
              validator(_, value) {
                if (value !== password) {
                  return Promise.reject(new Error('两次密码不一致'))
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            重置密码
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
