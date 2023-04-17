import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button, DatePicker, message, Select, Switch, Tag } from 'antd'
import { useState, useRef, useEffect } from 'react'
import {
  addVariable,
  deleteVariable,
  getTagList,
  getVariableList,
  updateVariable
} from '@/api/variable'
import AddVar from './AddVar'

const VariableTable: React.FC = () => {
  const [addOpen, setAddOpen] = useState(false) // 创建/编辑弹窗控制
  const planTableRef = useRef<ActionType>() // 计划表格事件触发对象
  const [tagList, setTagList] = useState<EnvTagInfo[]>([])

  const columns: ProColumns<VariableInfo>[] = [
    {
      title: '变量名',
      dataIndex: 'varName',
      ellipsis: true,
      width: 200,
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }] }
    },
    {
      title: '权重',
      dataIndex: 'weight',
      ellipsis: true,
      width: 100,
      search: false,
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }] },
      valueType: 'digit'
    },
    {
      title: '标签',
      dataIndex: 'tagId',
      ellipsis: true,
      width: 200,
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }] },
      renderFormItem: (schema, { isEditable }) => {
        return isEditable ? (
          <Select
            options={tagList.map((item) => ({ label: item.name, value: item.id }))}
            placeholder="请选择"
            optionFilterProp="label"
            showSearch
          />
        ) : (
          <Select
            options={tagList.map((item) => ({ label: item.name, value: item.id }))}
            mode="multiple"
            optionFilterProp="label"
            allowClear
            placeholder="请选择"
          />
        )
      },
      render: (text, record) => (
        <Tag>{tagList.find((item) => item.id == record.tagId)?.name || '-'}</Tag>
      )
    },
    {
      title: '变量值',
      dataIndex: 'value',
      ellipsis: true,
      search: false,
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }] },
      valueType: 'textarea'
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      width: 85,
      render: (dom, record, index, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id!)}>
          编辑
        </a>,
        <a
          key="del"
          style={{ color: 'red' }}
          onClick={() => {
            deleteVariable(record.id!).then((res) => {
              message.success(res.message)
              planTableRef.current?.reload()
            })
          }}
        >
          删除
        </a>
      ]
    }
  ]

  useEffect(() => {
    getTagList().then((res) => {
      setTagList(res.data || [])
    })
  }, [])

  // 创建计划
  const confirmAdd = async (values: VariableInfo, setLoading: (loading: boolean) => void) => {
    try {
      setLoading(true)
      if (values) {
        const res = await addVariable(values)
        if (res.status) {
          setAddOpen(false)
          planTableRef.current?.reload()
        }
      }
    } finally {
      setLoading(false)
    }
  }
  // plan列表查询方法
  const requestList = async (params: any, sorter: any, filter: any) => {
    const res = await getVariableList({ params, sorter, filter })
    return {
      data: res.data?.content,
      current: res.data?.current,
      total: res.data?.total,
      success: res.status
    }
  }
  // 修改计划
  const handlePlan = async (key: any, record: VariableInfo) => {
    const { id, value, varName, tagId, weight } = record
    const res = await updateVariable({ id, value, varName, tagId, weight })
    if (res.status) {
      message.success(res.message)
      return true
    } else {
      message.error(res.message)
      Promise.reject()
    }
  }
  // 确认删除框
  const deleteConfirm = async (key: any, record: VariableInfo) => {}

  return (
    <>
      <ProTable<VariableInfo>
        rowKey="id"
        columns={columns}
        request={requestList}
        actionRef={planTableRef}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        editable={{
          actionRender: (row, config, defaultDom) => [defaultDom.save, defaultDom.cancel],
          onSave: handlePlan
        }}
        dateFormatter="string"
        headerTitle="变量列表"
        toolBarRender={() => [
          <Button key="primary" type="primary" onClick={() => setAddOpen(true)}>
            添加变量
          </Button>
        ]}
        cardBordered
      />
      <AddVar
        open={addOpen}
        setOpen={setAddOpen}
        onOk={confirmAdd}
        tagList={tagList}
        setTagList={setTagList}
      />
    </>
  )
}
export default VariableTable
