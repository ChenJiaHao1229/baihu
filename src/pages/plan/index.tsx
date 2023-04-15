import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button, DatePicker, message, Switch } from 'antd'
import { useState, useRef } from 'react'
import { createPlan, deletePlan, getPlanList, runPlan, stopPlan, updatePlan } from '@/api/plan'
import AddPlan from './AddPlan'
import TaskTable from './TaskTable'
import Cron from 'react-cron-ts'

const { RangePicker } = DatePicker

const PlanTable: React.FC = () => {
  const [createOpen, setCreateOpen] = useState(false) // 创建/编辑弹窗控制
  const planTableRef = useRef<ActionType>() // 计划表格事件触发对象

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
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }] },
      renderFormItem: () => <Cron height={300} noYear />
    },
    {
      title: '状态',
      dataIndex: 'disable',
      ellipsis: true,
      hideInSearch: true,
      filters: true,
      onFilter: true,
      editable: false,
      valueEnum: {
        false: { text: '启用' },
        true: { text: '停用' }
      },
      renderText: (text, record) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="停用"
          defaultChecked={!text}
          onChange={(checked) => updatePlan({ id: record.id, disable: !checked })}
        />
      )
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
      render: (dom, record, index, action) => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12PX' }}
          >
            <a key="edit" onClick={() => action?.startEditable?.(record.id!)}>
              编辑
            </a>
            <a
              key="run"
              onClick={() => runPlan(record.id!).then((res) => message.success(res.message))}
            >
              运行
            </a>
            <a
              key="stop"
              onClick={() => stopPlan(record.id!).then((res) => message.success(res.message))}
            >
              暂停
            </a>
          </div>
        )
      }
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
  const handlePlan = async (key: any, record: PlanInfo) => {
    const { id, planName, cron } = record
    const res = await updatePlan({ id, planName, cron })
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
    const res = await deletePlan(record.id!)
    if (res.status) {
      message.success(res.message)
      planTableRef.current?.reload()
      return true
    } else {
      message.error(res.message)
      Promise.reject()
    }
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
          expandedRowRender: (record: PlanInfo, index: number, indent: number, expanded: boolean) =>
            expanded && <TaskTable data={record} />,
          fixed: true
        }}
        editable={{
          onSave: handlePlan,
          onDelete: deleteConfirm
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
