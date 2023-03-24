import { Form, Input, message, Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'

type AddFilePropsType = {
  open: boolean
  setOpen: (open: boolean) => any
  onOk: (value: FileInfo, setLoading: (loading: boolean) => void) => any
  data?: FileInfo
}

const AddFile: React.FC<AddFilePropsType> = ({ open, setOpen, data, onOk }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [label, setLabel] = useState('文件名')

  useEffect(() => {
    if (open) {
      form.resetFields()
      setLabel('文件名')
    }
    if (open && data) {
      form.setFieldsValue(data)
      setLabel(data.type ? '文件夹名称' : '文件名称')
    }
  }, [open])

  return (
    <Modal
      title={data ? '重命名' : '新建'}
      open={open}
      onCancel={() => setOpen(false)}
      bodyStyle={{ padding: '24px 0px' }}
      confirmLoading={loading}
      onOk={() => form.validateFields().then((values) => onOk({ ...data, ...values }, setLoading))}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="类型" name="type" rules={[{ required: true }]} initialValue={0}>
          <Select
            disabled={!!data}
            onSelect={(value) => setLabel(value ? '文件夹名称' : '文件名称')}
            options={[
              { label: '文件', value: 0 },
              { label: '文件夹', value: 1 }
            ]}
          />
        </Form.Item>
        <Form.Item label={label} name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入文件夹名称" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddFile
