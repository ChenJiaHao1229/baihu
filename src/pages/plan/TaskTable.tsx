import { addTask, deleteTask, getTaskList, runTask, updateTask } from '@/api/task'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Badge, Button, message, Tag, Tooltip, TreeSelect } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import AddTask from './AddTask'
import { getScriptAllList } from '@/api/script'
import constant from '@/utils/constant'
import { log } from 'console'

type TaskTablePropsType = { data: PlanInfo }

const statusList: {
  text: string
  status: 'success' | 'processing' | 'error' | 'default' | 'warning'
}[] = [
  { text: '正常', status: 'success' },
  { text: '运行中', status: 'processing' },
  { text: '禁用', status: 'warning' },
  { text: '异常', status: 'error' }
]
const TaskTable: React.FC<TaskTablePropsType> = ({ data }) => {
  const [dataSource, setDataSource] = useState<TaskInfo[]>([])
  const [open, setOpen] = useState(false)
  const taskTableRef = useRef<ActionType>() // 任务表格事件触发对象
  const [treeData, setTreeData] = useState<FileInfo[]>([])

  const columns: ProColumns<TaskInfo>[] = [
    { title: '任务名称', dataIndex: 'taskName', ellipsis: true },
    {
      title: '文件路径',
      dataIndex: 'path',
      ellipsis: true,
      renderFormItem: (schema, { record }) => {
        const tree = formatTreeData(treeData, '', record?.path)
        return (
          <TreeSelect
            treeData={tree}
            defaultValue={record?.path}
            fieldNames={{ value: 'key' }}
            dropdownMatchSelectWidth={400}
          />
        )
      }
    },
    {
      title: '运行状态',
      dataIndex: 'status',
      ellipsis: true,
      filters: true,
      onFilter: true,
      editable: false,
      valueEnum: {
        0: { text: '正常' },
        1: { text: '运行中' },
        2: { text: '禁用' },
        3: { text: '异常' }
      },
      renderText: (text, record) => {
        const status = text || text === 0 ? statusList[text] : statusList[3]
        return <Badge status={status.status} text={status.text} />
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      ellipsis: true,
      valueType: 'dateTime',
      editable: false,
      sorter: true
    },
    {
      title: '上次运行',
      dataIndex: 'runTime',
      ellipsis: true,
      valueType: 'dateTime',
      editable: false
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

  useEffect(() => {
    getScriptAllList().then((res) => {
      if (res.status) setTreeData(res.data || [])
      else message.error(res.message)
    })
  }, [])

  // 处理数据
  const formatTreeData = (
    file: (FileInfo & { label?: React.ReactNode; selectable?: boolean })[],
    path: string = '',
    key?: string
  ) => {
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
      item.selectable = item.type !== 0
      // 判断是否有子文件
      if (item.children) item.children = formatTreeData(item.children, item.key)
    })
    // 过滤掉非脚本文件  已经添加了的脚本文件 以及自身不过滤
    return file.filter((item) => {
      if (item.type === 0) {
        return !item.children || item.children.length !== 0
      } else {
        return (
          constant.scriptFileList.includes(item.type as string) &&
          (item.key === key || !dataSource.map((item) => item.path!).includes(item.key))
        )
      }
    })
  }

  // 确认添加
  const confirmAdd = async (task: TaskInfo, setLoading: (loading: boolean) => void) => {
    try {
      setLoading(true)
      const res = await addTask({ ...task, planId: data.id })
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
          const res = await getTaskList({ planId: data.id! })
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
        onOk={confirmAdd}
        treeData={formatTreeData(treeData)}
      />
    </>
  )
}

export default TaskTable
