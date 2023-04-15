import { Form, Input, Modal, TreeSelect } from 'antd'
import React, { useEffect, useState } from 'react'

type AddTaskPropsType = {
  open: boolean
  treeData: FileInfo[]
  setOpen: (open: boolean) => void
  onOk: (data: PlanInfo, setLoading: (loading: boolean) => void) => void
}

const AddTask: React.FC<AddTaskPropsType> = ({ open, setOpen, onOk, treeData }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (open) form.resetFields()
  }, [open])

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title="添加任务"
      confirmLoading={loading}
      onOk={async () => {
        const values = await form.validateFields()
        onOk(values, setLoading)
      }}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item label="任务名称" name="taskName" rules={[{ required: true }, { max: 50 }]}>
          <Input placeholder="请输入任务名称" />
        </Form.Item>
        <Form.Item label="运行脚本" name="path" rules={[{ required: true }]}>
          <TreeSelect
            treeData={treeData}
            placeholder="请选择脚本"
            fieldNames={{ value: 'key' }}
            showSearch={true}
            filterTreeNode={(inputValue: string, treeNode: any) =>
              treeNode.key.indexOf(inputValue) !== -1
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddTask
