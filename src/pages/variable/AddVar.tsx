import { addTag } from '@/api/variable'
import constant from '@/utils/constant'
import { FileTextOutlined, FolderOpenOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  TreeSelect
} from 'antd'
import React, { useEffect, useState } from 'react'
import Cron from 'react-cron-ts'

type AddVarPropsType = {
  open: boolean
  tagList: EnvTagInfo[]
  setOpen: (open: boolean) => void
  setTagList: (tagList: EnvTagInfo[]) => void
  onOk: (data: PlanInfo, setLoading: (loading: boolean) => void) => void
}

const AddVar: React.FC<AddVarPropsType> = ({ open, setOpen, onOk, tagList, setTagList }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [tag, setTag] = useState('')

  useEffect(() => {
    if (open) form.resetFields()
  }, [open])
  const onTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTag(event.target.value)
  }

  const handleAddTag = () => {
    if (!tag) return
    addTag({ name: tag }).then((res) => {
      setTagList([...tagList, res.data!])
      setTag('')
    })
  }

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title="添加变量"
      confirmLoading={loading}
      onOk={async () => {
        const values = await form.validateFields()
        onOk(values, setLoading)
      }}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item label="变量名" name="varName" rules={[{ required: true }, { max: 50 }]}>
          <Input placeholder="请输入变量名" />
        </Form.Item>
        <Form.Item label="权重" name="weight" initialValue={1} rules={[{ required: true }]}>
          <InputNumber placeholder="请输入权重" />
        </Form.Item>
        <Form.Item label="标签" name="tagId" rules={[{ required: true }]}>
          <Select
            placeholder="请选择标签"
            optionFilterProp="label"
            showSearch
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', gap: '8px', padding: '4px 8px' }}>
                  <Input placeholder="请输入标签名" value={tag} onChange={onTagChange} />
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTag}>
                    新增标签
                  </Button>
                </div>
              </>
            )}
            options={tagList.map((item) => ({ label: item.name, value: item.id }))}
          />
        </Form.Item>
        <Form.Item label="变量值" name="value" rules={[{ required: true }]}>
          <Input.TextArea placeholder="请输入变量值" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddVar
