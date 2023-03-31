import { getScriptAllList } from '@/api/script'
import constant from '@/utils/constant'
import { FileTextOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { Form, Input, message, Modal, TreeSelect } from 'antd'
import React, { useEffect, useState } from 'react'

type AddTaskPropsType = {
  open: boolean
  data: string[]
  setOpen: (open: boolean) => void
  onOk: (data: PlanInfo, setLoading: (loading: boolean) => void) => void
}

const AddTask: React.FC<AddTaskPropsType> = ({ open, setOpen, onOk, data }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [treeData, setTreeData] = useState<FileInfo[]>([])

  useEffect(() => {
    if (open) {
      form.resetFields()
      getScriptAllList().then((res) => {
        if (res.status)
          // 对数据进行处理
          setTreeData(formatTreeData(res.data!))
        else message.error(res.message)
      })
    }
  }, [open])

  // 处理数据
  const formatTreeData = (file: (FileInfo & { label?: React.ReactNode })[], path: string = '') => {
    file.forEach((item) => {
      item.key = `${path}/${item.name}`
      item.label = (
        <span>
          {item.type === 0 ? (
            <FolderOpenOutlined />
          ) : (
            constant.fileInfo[item.type]?.icon || <FileTextOutlined />
          )}
          &nbsp; {item.name}
        </span>
      )
      // 判断是否有子文件
      if (item.children) item.children = formatTreeData(item.children, item.key)
    })
    return file.filter((item) => {
      if (item.type === 0) {
        return !item.children || item.children.length !== 0
      } else {
        return constant.scriptFileList.includes(item.type as string) && !data.includes(item.key)
      }
    })
  }

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
            allowClear
            treeLine
            treeIcon
            treeData={treeData}
            placeholder="请选择脚本"
            fieldNames={{ value: 'key' }}
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
