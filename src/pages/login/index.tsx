import { useState, useEffect } from 'react'
import { Button, Form, Input, message } from 'antd'
import { userLogin } from '@/api/user'
import constant from '@/utils/constant'
import './index.less'
import { useNavigate } from 'react-router-dom'
import cryptoJS from 'crypto-js'

const Login = () => {
  const [form] = Form.useForm<UserInfo>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [waitTime, setWaitTime] = useState(0)

  // 定时器
  useEffect(() => {
    if (waitTime > 0) {
      setTimeout(() => {
        setWaitTime(waitTime - 1)
      }, 1000)
    }
  }, [waitTime])

  // 提交登录
  const login = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields()
      const { username, password } = values
      const res = await userLogin({ username, password: cryptoJS.MD5(password).toString() })
      if (res.status) {
        message.success(res.message)
        // 存储token数据
        localStorage.setItem(constant.authToken, res.data?.token || '')
        navigate(`/task`)
      } else {
        message.error(res.message)
        if ([410, 403].includes(res.code!) && res.data!.waitTime) {
          setWaitTime(res.data!.waitTime!)
        }
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="login">
      <div className="login-form">
        <div className="login-form-head">登&nbsp;&nbsp;录</div>
        <Form form={form} size="large" labelCol={{ span: 4 }} labelAlign="left">
          <Form.Item
            name="username"
            label="用户名"
            hasFeedback
            rules={[{ required: true }, { max: 50 }]}
          >
            <Input placeholder="用户名" autoFocus />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            hasFeedback
            rules={[{ required: true }, { max: 50 }]}
          >
            <Input type="password" placeholder="密码" />
          </Form.Item>
        </Form>
        <div style={{ marginTop: 80 }}>
          <Button
            className="login-form-button"
            loading={loading}
            onClick={login}
            disabled={!!waitTime}
          >
            {waitTime ? `请等待${waitTime}秒后重试` : '登录'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login
