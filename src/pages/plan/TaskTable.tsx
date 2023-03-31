import { addTask, deleteTask, getTaskList, runTask, updateTask } from '@/api/task'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Button, message, Tag, Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import AddTask from './AddTask'

type TaskTablePropsType = { record: PlanInfo }

const statusList = [
  { text: '正常', color: 'success', icon: <CheckCircleOutlined />, title: '点击运行' },
  { text: '运行中', color: 'processing', icon: <SyncOutlined spin />, title: '点击暂停' },
  { text: '禁用', color: 'warning', icon: <ExclamationCircleOutlined />, title: '点击解禁' },
  { text: '异常', color: 'error', icon: <CloseCircleOutlined />, title: '点击重新运行' }
]
const TaskTable: React.FC<TaskTablePropsType> = ({ record }) => {
  const [dataSource, setDataSource] = useState<TaskInfo[]>([])
  const [open, setOpen] = useState(false)
  const taskTableRef = useRef<ActionType>() // 任务表格事件触发对象

  const columns: ProColumns<TaskInfo>[] = [
    { title: '任务名称', dataIndex: 'taskName', ellipsis: true },
    { title: '文件路径', dataIndex: 'path', ellipsis: true },
    {
      title: '运行状态',
      dataIndex: 'status',
      ellipsis: true,
      filters: true,
      onFilter: true,
      valueEnum: {
        0: { text: '正常' },
        1: { text: '运行中' },
        2: { text: '禁用' },
        3: { text: '异常' }
      },
      renderText: (text, record) => {
        const status = text || text === 0 ? statusList[text] : statusList[3]
        return (
          <Tooltip title={status.title}>
            <Tag
              icon={status.icon}
              color={status.color}
              className="pointer"
              onClick={() => clickTag(record)}
            >
              {status.text}
            </Tag>
          </Tooltip>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      ellipsis: true,
      valueType: 'dateTime',
      sorter: true
    },
    {
      title: '上次运行',
      dataIndex: 'runTime',
      ellipsis: true,
      valueType: 'dateTime'
    },
    {
      title: () => {
        return (
          <>
            操作&nbsp;&nbsp;
            <Button type="primary" onClick={() => setOpen(true)}>
              添加
            </Button>
          </>
        )
      },
      dataIndex: 'action',
      key: 'action',
      valueType: 'option',
      width: 140,
      render: (dom, record, index, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id!)}>
          编辑
        </a>,
        record.status !== 2 && <a key="forbid">禁用</a>,
        record.status === 2 && <a key="unlock">解禁</a>
      ]
    }
  ]
  // 点击tag
  const clickTag = (task: TaskInfo) => {
    switch (task.status) {
      case 0:
        runTask({ id: task.id })
        break
    }
  }
  // 确认添加
  const confirmAdd = async (task: TaskInfo, setLoading: (loading: boolean) => void) => {
    try {
      setLoading(true)
      const res = await addTask({ ...task, planId: record.id })
      if (res.status) {
        setOpen(false)
        taskTableRef.current?.reload()
      }
    } finally {
      setLoading(false)
    }
  }
  // 修改计划
  const handlerTask = async (key: any, record: PlanInfo) => {
    const res = await updateTask(record)
    if (res.status) {
      message.success(res.message)
      return true
    } else {
      message.error(res.message)
      Promise.reject()
    }
  }
  // 确认删除框
  const deleteConfirm = async (key: any, record: PlanInfo) => {
    const res = await deleteTask(record.id!)
    if (res.status) {
      message.success(res.message)
      return true
    } else {
      message.error(res.message)
      Promise.reject()
    }
  }
  return (
    <>
      <ProTable
        rowKey="id"
        columns={columns}
        headerTitle={false}
        search={false}
        options={false}
        actionRef={taskTableRef}
        pagination={false}
        onDataSourceChange={setDataSource}
        request={async (params: any, sorter: any, filter: any) => {
          const res = await getTaskList({ planId: record.id! })
          return {
            data: res.data,
            success: res.status
          }
        }}
        editable={{
          onSave: handlerTask,
          onDelete: deleteConfirm
        }}
      />
      <AddTask
        open={open}
        setOpen={setOpen}
        data={dataSource.map((item) => item.path!)}
        onOk={confirmAdd}
      />
    </>
  )
}

export default TaskTable
