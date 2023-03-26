import { getTaskList } from '@/api/task'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Tag, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'

type TaskTablePropsType = { record: PlanInfo }

const statusList = [
  { text: '正常', color: 'success', icon: <CheckCircleOutlined />, title: '点击运行' },
  { text: '运行中', color: 'processing', icon: <SyncOutlined spin />, title: '点击暂停' },
  { text: '禁用', color: 'warning', icon: <ExclamationCircleOutlined />, title: '点击解禁' },
  { text: '异常', color: 'error', icon: <CloseCircleOutlined />, title: '点击重新运行' }
]
const TaskTable: React.FC<TaskTablePropsType> = ({ record }) => {
  const [dataSource, setDataSource] = useState<TaskInfo[]>([])

  const columns: ProColumns<TaskInfo>[] = [
    { title: '任务名称', dataIndex: 'taskName', ellipsis: true },
    { title: '文件路径', dataIndex: 'path', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      ellipsis: true,
      filters: true,
      onFilter: true,
      tooltip: '可点击标签进行操作',
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
            <Tag icon={status.icon} color={status.color} className="pointer">
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
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      valueType: 'option',
      width: 100,
      render: (dom, record) => [
        record.status !== 2 && <a key="forbid">禁用</a>,
        record.status === 2 && <a key="unlock">解禁</a>,
        <a key="del" style={{ color: 'red' }}>
          删除
        </a>
      ]
    }
  ]
  useEffect(() => {
    getTaskList({ planId: record.id! }).then((res) => setDataSource(res.data || []))
  }, [])
  return (
    <ProTable
      columns={columns}
      headerTitle={false}
      search={false}
      options={false}
      dataSource={dataSource}
      pagination={false}
    />
  )
}

export default TaskTable
