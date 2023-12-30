import { Form, Input, Modal, Select } from 'antd'
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
  const [label, setLabel] = useState('文件名称')

  useEffect(() => {
    if (open) {
      form.resetFields()
      setLabel('文件名称')
    }
    if (open && data) {
      form.setFieldsValue({ ...data, type: data.type ? 1 : 0 })
      setLabel(data.type ? '文件名称' : '文件夹名称')
    }
  }, [open])

  return (
    <Modal
      title={data ? '重命名' : '新建'}
      open={open}
      onCancel={() => setOpen(false)}
      confirmLoading={loading}
      onOk={() => form.validateFields().then((values) => onOk({ ...data, ...values }, setLoading))}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="类型" name="type" rules={[{ required: true }]} initialValue={1}>
          <Select
            disabled={!!data}
            onSelect={(value) => setLabel(value ? '文件名称' : '文件夹名称')}
            options={[
              { label: '文件', value: 1 },
              { label: '文件夹', value: 0 }
            ]}
          />
        </Form.Item>
        <Form.Item label={label} name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddFile
