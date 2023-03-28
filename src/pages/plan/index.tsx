import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Button, DatePicker, message, Modal, Tag, Tooltip } from 'antd'
import { useState, useRef } from 'react'
import { createPlan, deletePlan, getPlanList, updatePlan } from '@/api/plan'
import AddPlan from './AddPlan'
import TaskTable from './TaskTable'

const { RangePicker } = DatePicker
const { confirm } = Modal

const statusList = [
  { text: '正常', color: 'success', title: '点击运行' },
  { text: '禁用', color: 'warning', title: '点击解禁' }
]
const PlanTable: React.FC = () => {
  const [createOpen, setCreateOpen] = useState(false) // 创建/编辑弹窗控制
  const planTableRef = useRef<ActionType>() // 计划表格事件触发对象

  // 确认删除框
  const deleteConfirm = (record: PlanInfo) => {
    confirm({
      title: '确定删除?',
      icon: <ExclamationCircleFilled />,
      okType: 'danger',
      onOk() {
        deletePlan(record.id!).then((res) => {
          if (res.status) {
            message.success(res.message)
            planTableRef.current?.reload()
          } else message.error(res.message)
        })
      }
    })
  }
  const columns: ProColumns<PlanInfo>[] = [
    {
      title: '计划名称',
      dataIndex: 'planName',
      ellipsis: true,
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }] }
    },
    {
      title: '定时规则',
      dataIndex: 'cron',
      ellipsis: true,
      hideInSearch: true,
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }] }
    },
    {
      title: '状态',
      dataIndex: 'status',
      ellipsis: true,
      hideInSearch: true,
      filters: true,
      onFilter: true,
      editable: false,
      tooltip: '可点击标签进行操作',
      valueEnum: {
        0: { text: '正常' },
        1: { text: '禁用' }
      },
      renderText: (text) => {
        const status = text === 0 ? statusList[0] : statusList[1]
        return (
          <Tooltip title={status.title}>
            <Tag color={status.color} className="pointer">
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
      sorter: true,
      editable: false,
      renderFormItem: () => <RangePicker />
    },
    {
      title: '上次运行',
      dataIndex: 'lastRunTime',
      ellipsis: true,
      valueType: 'dateTime',
      editable: false,
      hideInSearch: true
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      width: 140,
      render: (dom, record, index, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id!)}>
          编辑
        </a>,
        <a key="stop">暂停</a>,
        <a key="del" onClick={() => deleteConfirm(record)} style={{ color: 'red' }}>
          删除
        </a>
      ]
    }
  ]
  // 创建计划
  const confirmCreate = async (values: PlanInfo, setLoading: (loading: boolean) => void) => {
    try {
      setLoading(true)
      if (values) {
        const res = await createPlan(values)
        if (res.status) {
          setCreateOpen(false)
          planTableRef.current?.reload()
        }
      }
    } finally {
      setLoading(false)
    }
  }
  // plan列表查询方法
  const requestList = async (params: any, sorter: any, filter: any) => {
    const res = await getPlanList({ params, sorter, filter })
    return {
      data: res.data?.content,
      current: res.data?.current,
      total: res.data?.total,
      success: res.status
    }
  }
  // 修改计划
  const handlePlan = (key: any, record: PlanInfo) => {
    return new Promise(async (resolve, reject) => {
      const res = await updatePlan(record.id!, record)
      if (res.status) {
        message.success(res.message)
        resolve(res.status)
      } else {
        message.error(res.message)
        reject()
      }
    })
  }

  return (
    <>
      <ProTable<PlanInfo>
        rowKey="id"
        columns={columns}
        request={requestList}
        actionRef={planTableRef}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        expandable={{
          expandedRowRender: (record: PlanInfo) => <TaskTable record={record} />,
          fixed: true
        }}
        editable={{
          type: 'single',
          actionRender: (row, config, defaultDoms) => [defaultDoms.save, defaultDoms.cancel],
          onSave: handlePlan
        }}
        dateFormatter="string"
        headerTitle="计划列表"
        toolBarRender={() => [
          <Button key="primary" type="primary" onClick={() => setCreateOpen(true)}>
            创建计划
          </Button>
        ]}
        cardBordered
        options={{ setting: true }}
      />
      <AddPlan open={createOpen} setOpen={setCreateOpen} onOk={confirmCreate} />
    </>
  )
}
export default PlanTable
