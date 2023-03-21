import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Modal, Tag } from 'antd'
import { useEffect, useState, useRef } from 'react'
import { createTask, getTaskList, updateTask } from '@/api/task'

const { RangePicker } = DatePicker

const statusList = [
  { text: '正常', color: 'success', icon: <CheckCircleOutlined /> },
  { text: '运行中', color: 'processing', icon: <SyncOutlined spin /> },
  { text: '禁用', color: 'warning', icon: <ExclamationCircleOutlined /> },
  { text: '异常', color: 'error', icon: <CloseCircleOutlined /> },
  { text: '未知', color: 'default', icon: <QuestionCircleOutlined /> }
]
const TaskTable = () => {
  const [form] = Form.useForm() // 创建任务的表单对象
  const [createOpen, setCreateOpen] = useState(false) // 创建/编辑弹窗控制
  const [operation, setOperation] = useState<TaskInfo>() // 选中操作的数据
  const [loading, setLoading] = useState(false) // 弹窗确认按钮加载控制
  const taskTableRef = useRef<ActionType>() // 任务表格事件触发对象
  const expandedRowRender = (
    record: TaskInfo,
    index: number,
    indent: number,
    expanded: boolean
  ) => {
    const data = []
    for (let i = 0; i < 3; i += 1) {
      data.push({
        key: i,
        date: '2014-12-24 23:12:00',
        name: 'This is production name',
        upgradeNum: 'Upgraded: 56'
      })
    }
    return (
      <ProTable
        columns={[
          { title: 'Date', dataIndex: 'date', key: 'date' },
          { title: 'Name', dataIndex: 'name', key: 'name' },

          { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
          {
            title: 'Action',
            dataIndex: 'operation',
            key: 'operation',
            valueType: 'option',
            render: () => [<a key="Pause">Pause</a>, <a key="Stop">Stop</a>]
          }
        ]}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={data}
        pagination={false}
      />
    )
  }

  const columns: ProColumns<TaskInfo>[] = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      ellipsis: true
    },
    {
      title: '定时规则',
      dataIndex: 'cron',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      ellipsis: true,
      hideInSearch: true,
      filters: true,
      onFilter: true,
      valueEnum: {
        0: { text: '正常' },
        1: { text: '运行中' },
        2: { text: '禁用' },
        3: { text: '异常' },
        4: { text: '未知' }
      },
      renderText: (text) => {
        const status = text || text === 0 ? statusList[text] : statusList[4]
        return (
          <Tag icon={status.icon} color={status.color}>
            {status.text}
          </Tag>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      ellipsis: true,
      valueType: 'dateTime',
      sorter: true,
      renderFormItem: () => <RangePicker />
    },
    {
      title: '上次运行',
      dataIndex: 'lastRunTime',
      ellipsis: true,
      valueType: 'dateTime',
      hideInSearch: true
    },
    {
      title: '运行时长',
      dataIndex: 'runTime',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      valueType: 'option',
      width: 240,
      render: (dom, record) => [
        record.status !== 1 && <a key="run">运行</a>,
        record.status === 1 && <a key="stop">暂停</a>,
        record.status !== 2 && <a key="forbid">禁用</a>,
        record.status === 2 && <a key="unlock">解禁</a>,
        <a
          key="edit"
          onClick={() => {
            setCreateOpen(true)
            setOperation(record)
            form.setFieldsValue(record)
          }}
        >
          编辑
        </a>,
        <a key="del">删除</a>
      ]
    }
  ]
  // 创建任务
  const confirmCreate = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      if (values) {
        const res = operation ? await updateTask(operation.id!, values) : await createTask(values)
        if (res.status) {
          setCreateOpen(false)
          taskTableRef.current?.reload()
        }
      }
    } finally {
      setLoading(false)
    }
  }
  // task列表查询方法
  const requestList = async (params: any, sorter: any, filter: any) => {
    const res = await getTaskList({ params, sorter, filter })
    return {
      data: res.data?.content,
      current: res.data?.current,
      total: res.data?.total,
      success: res.status
    }
  }

  return (
    <>
      <ProTable<TaskInfo>
        rowKey="id"
        columns={columns}
        request={requestList}
        actionRef={taskTableRef}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        expandable={{ expandedRowRender, fixed: true }}
        dateFormatter="string"
        headerTitle="任务列表"
        toolBarRender={() => [
          <Button
            key="primary"
            type="primary"
            onClick={() => {
              form.resetFields()
              setCreateOpen(true)
              setOperation(undefined)
            }}
          >
            创建任务
          </Button>
        ]}
        cardBordered
        options={{ setting: true }}
      />
      <Modal
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        title={operation ? '编辑任务' : '创建任务'}
        onOk={confirmCreate}
        confirmLoading={loading}
      >
        <Form form={form} labelCol={{ span: 4 }}>
          <Form.Item label="任务名" name="taskName" rules={[{ required: true }, { max: 50 }]}>
            <Input placeholder="请输入任务名" />
          </Form.Item>
          <Form.Item label="定时规则" name="cron" rules={[{ required: true }, { max: 255 }]}>
            <Input placeholder="请输入Cron表达式" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default TaskTable
