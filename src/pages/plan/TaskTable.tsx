import { addTask, deleteTask, getTaskList, runTask, updateTask } from '@/api/task'
import { FileTextOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Badge, Button, message, Switch, Tag, Tooltip, TreeSelect } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import AddTask from './AddTask'
import { getScriptAllList } from '@/api/script'
import constant from '@/utils/constant'

type TaskTablePropsType = { data: PlanInfo }

const statusList: {
  text: string
  status: 'success' | 'processing' | 'warning' | 'error'
}[] = [
  { text: '禁用', status: 'warning' },
  { text: '正常', status: 'success' },
  { text: '运行中', status: 'processing' },
  { text: '错误', status: 'error' }
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
      title: '任务状态',
      ellipsis: true,
      renderText: (text, record) => (
        <Badge status={statusList[record.status!].status} text={statusList[record.status!].text} />
      ),
      renderFormItem: (schema, { record }) => (
        <Switch checkedChildren="启用" unCheckedChildren="停用" defaultChecked={!record?.disable} />
      )
    },
    {
      title: '运行时间',
      dataIndex: 'runTime',
      ellipsis: true,
      valueType: 'dateTime',
      editable: false,
      sorter: true
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
        record.status === 2 ? (
          <a key="stop">暂停</a>
        ) : (
          <a
            key="run"
            onClick={() => {
              runTask(record.id!).then(() => {
                setDataSource(
                  dataSource.map((item) => {
                    if (item.id === record.id) return { ...record, status: 2 }
                    else return item
                  })
                )
              })
            }}
          >
            运行
          </a>
        )
      ]
    }
  ]

  useEffect(() => {
    getScriptAllList().then((res) => setTreeData(res.data || []))
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
  const handlerTask = async (key: any, record: TaskInfo) => {
    const res = await updateTask({
      id: record.id,
      taskName: record.taskName,
      path: record.path,
      disable: !record.disable
    })
    if (res.status) {
      message.success(res.message)
      console.log(record)

      record.disable = !record.disable
      return true
    } else {
      message.error(res.message)
      Promise.reject()
    }
  }
  // 确认删除框
  const deleteConfirm = async (key: any, record: TaskInfo) => {
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
    </>
  )
}

export default TaskTable
