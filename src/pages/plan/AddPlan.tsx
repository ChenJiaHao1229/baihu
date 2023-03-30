import { getScriptAllList } from '@/api/script'
import constant from '@/utils/constant'
import { FileTextOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { Form, Input, message, Modal, TreeSelect } from 'antd'
import React, { useEffect, useState } from 'react'

type AddPlanPropsType = {
  open: boolean
  setOpen: (open: boolean) => void
  onOk: (data: PlanInfo, setLoading: (loading: boolean) => void) => void
}

const AddPlan: React.FC<AddPlanPropsType> = ({ open, setOpen, onOk }) => {
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
  const formatTreeData = (data: (FileInfo & { label?: React.ReactNode })[], path: string = '') => {
    data.forEach((item) => {
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
    return data.filter((item) => {
      if (item.type === 0) {
        return !item.children || item.children.length !== 0
      } else {
        return constant.scriptFileList.includes(item.type as string)
      }
    })
  }

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title="创建计划"
      confirmLoading={loading}
      onOk={async () => {
        const values = await form.validateFields()
        onOk(values, setLoading)
      }}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item label="计划名" name="planName" rules={[{ required: true }, { max: 50 }]}>
          <Input placeholder="请输入计划名" />
        </Form.Item>
        <Form.Item label="定时规则" name="cron" rules={[{ required: true }, { max: 255 }]}>
          <Input placeholder="请输入Cron表达式" />
        </Form.Item>
        <Form.Item label="运行脚本" name="tasks" rules={[{ required: true }]}>
          <TreeSelect
            multiple
            allowClear
            treeLine
            treeCheckable
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

export default AddPlan
