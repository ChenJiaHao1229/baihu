import React from 'react'
import { Button, Form, Input, message } from 'antd'
import { RuleObject } from 'antd/es/form'
import { StoreValue } from 'antd/es/form/interface'
import { updatePwd } from '@/api/user'
import constant from '@/utils/constant'
import { useNavigate } from 'react-router-dom'
import cryptoJS from 'crypto-js'

const PasswordManage: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  // 表单验证成功回调
  const onFinish = ({ oldPwd, newPwd }: updatePwdType) => {
    updatePwd({
      // 简单的md5加密一下
      oldPwd: cryptoJS.MD5(oldPwd).toString(),
      newPwd: cryptoJS.MD5(newPwd).toString()
    }).then((res) => {
      if (oldPwd === newPwd) {
        message.warning('新密码不能和旧密码相同！')
        return
      }
      if (res.status) {
        message.success(res.message)
        localStorage.removeItem(constant.authToken)
        navigate('/login')
      } else {
        message.error(res.message)
      }
    })
  }

  return (
    <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} onFinish={onFinish}>
      <Form.Item label="旧密码" name="oldPwd" rules={[{ required: true }]}>
        <Input type="password" placeholder="请输入旧密码" />
      </Form.Item>
      <Form.Item label="新密码" name="newPwd" rules={[{ required: true }]}>
        <Input type="password" placeholder="请输入新密码" />
      </Form.Item>
      <Form.Item
        label="确认密码"
        name="pwd"
        required
        rules={[
          { required: true },
          {
            validator: (
              rule: RuleObject,
              value: StoreValue,
              callback: (error?: string) => void
            ) => {
              if (value !== form.getFieldValue('newPwd')) {
                callback('两次密码不相同！')
              } else {
                callback()
              }
            }
          }
        ]}
      >
        <Input type="password" placeholder="请再次输入新密码" />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
        <Button type="default" htmlType="reset">
          重置
        </Button>
        <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}

export default PasswordManage
