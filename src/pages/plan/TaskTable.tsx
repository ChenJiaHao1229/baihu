import { addTask, deleteTask, getTaskList, runTask, stopTask, updateTask } from '@/api/task'
import { FileTextOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Badge, Button, message, Modal, TreeSelect } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useInterval } from 'ahooks'
import AddTask from './AddTask'
import { getScriptAllList } from '@/api/script'
import constant from '@/utils/constant'
import { getLatestLogContent } from '@/api/logs'

type TaskTablePropsType = { data: PlanInfo }

const statusList: {
  text: string
  status: 'success' | 'processing' | 'error'
}[] = [
  { text: '正常', status: 'success' },
  { text: '运行中', status: 'processing' },
  { text: '错误', status: 'error' }
]
const TaskTable: React.FC<TaskTablePropsType> = ({ data }) => {
  const [dataSource, setDataSource] = useState<TaskInfo[]>([])
  const [open, setOpen] = useState(false)
  const taskTableRef = useRef<ActionType>() // 任务表格事件触发对象
  const [treeData, setTreeData] = useState<FileInfo[]>([])
  const [log, setLog] = useState<string>('')
  const [logOpen, setLogOpen] = useState<boolean>(false)

  const columns: ProColumns<TaskInfo>[] = [
    { title: '任务名称', dataIndex: 'taskName', ellipsis: true },
    {
      title: '文件路径',
      dataIndex: 'path',
      ellipsis: true,
      renderFormItem: (schema, { record }) => {
        const tree = formatTreeData(treeData, '', record?.id)
        return (
          <TreeSelect treeData={tree} fieldNames={{ value: 'key' }} popupMatchSelectWidth={400} />
        )
      }
    },
    {
      title: '任务状态',
      ellipsis: true,
      editable: false,
      renderText: (text, record) => (
        <Badge status={statusList[record.status!].status} text={statusList[record.status!].text} />
      )
    },
    {
      title: '上次运行时间',
      dataIndex: 'runTime',
      ellipsis: true,
      editable: false,
      renderText: (text) => {
        if (text === 0) return '0秒'
        if (!text) return '-'
        const hour = Math.floor(text / 60 / 60)
        const minute = Math.floor((text % (60 * 60)) / 60)
        const second = Math.floor((text % (60 * 60)) % 60)
        return `${hour ? `${hour}小时` : ''}${minute ? `${minute}分` : ''}${
          second && `${second}秒`
        }`
      }
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
        record.status === 1 ? (
          <a
            key="stop"
            onClick={() => {
              stopTask(record.id!).then((res) => {
                message.success(res.message)
                setDataSource(
                  dataSource.map((item) => {
                    if (item.id === record.id) return { ...record, status: 0 }
                    else return item
                  })
                )
              })
            }}
          >
            中止
          </a>
        ) : (
          <a
            key="run"
            onClick={() => {
              runTask(record.id!).then((res) => {
                message.success(res.message)
                setDataSource(
                  dataSource.map((item) => {
                    if (item.id === record.id) return { ...record, status: 1 }
                    else return item
                  })
                )
              })
            }}
          >
            运行
          </a>
        ),
        <a onClick={() => clickLog(record)}>日志</a>
      ]
    }
  ]

  useInterval(() => {
    getTaskList({ planId: data.id! }).then((res) => setDataSource(res.data || []))
  }, 5000)

  useEffect(() => {
    getScriptAllList().then((res) => setTreeData(res.data || []))
  }, [])

  const clickLog = ({ taskName }: TaskInfo) => {
    const { planName } = data
    getLatestLogContent(`/${planName}/${taskName}`).then((res) => {
      setLogOpen(true)
      setLog(res.data!)
    })
  }

  // 处理数据
  const formatTreeData = (
    file: (FileInfo & { label?: React.ReactNode; selectable?: boolean })[],
    path: string = '',
    id?: string
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
          (!id ||
            !dataSource
              .filter((item) => item.id !== id)
              .map((item) => item.path!)
              .includes(item.key))
        )
      }
    })
  }

  // 确认添加
  const confirmAdd = async (task: TaskInfo, setLoading: (loading: boolean) => void) => {
    try {
      setLoading(true)
      await addTask({ ...task, planId: data.id })
      setOpen(false)
      taskTableRef.current?.reload()
    } finally {
      setLoading(false)
    }
  }
  // 修改计划
  const handlerTask = async (key: any, record: TaskInfo) => {
    const res = await updateTask({
      id: record.id,
      taskName: record.taskName,
      path: record.path
    })
    message.success(res.message)
    return true
  }
  // 确认删除框
  const deleteConfirm = async (key: any, record: TaskInfo) => {
    const res = await deleteTask(record.id!)
    message.success(res.message)
    return true
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
        dataSource={dataSource}
        request={async (params: any, sorter: any, filter: any) => {
          const res = await getTaskList({ planId: data.id! })
          setDataSource(res.data || [])
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
      <Modal
        title="日志"
        open={logOpen}
        width={800}
        onCancel={() => setLogOpen(false)}
        footer={<Button onClick={() => setLogOpen(false)}>关闭</Button>}
      >
        <pre
          style={{
            height: 600,
            overflow: 'scroll',
            background: '#f7f7f7',
            borderRadius: 4,
            padding: 16
          }}
        >
          {log || '暂无日志'}
        </pre>
      </Modal>
    </>
  )
}

export default TaskTable
