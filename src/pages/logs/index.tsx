import React, { Key, useEffect, useMemo, useState } from 'react'
import { Button, Input, Modal, Tree, message } from 'antd'
import { deleteLogs, getLogContent, getLogs } from '@/api/logs'
import styles from './index.module.less'
import { TreeProps } from 'antd/lib'

const filterTree = (treeData: FileInfo[], searchValue: string): FileInfo[] => {
  return treeData
    .map((item) => {
      const matchingItem: FileInfo | null = filterItem(item, searchValue)
      if (matchingItem) return matchingItem
      return null
    })
    .filter(Boolean) as FileInfo[]
}
const filterItem = (item: FileInfo, searchValue: string): FileInfo | null => {
  if (item.name.includes(searchValue)) return item
  if (item.children && item.children.length > 0) {
    const children = filterTree(item.children, searchValue)
    if (children.length > 0) return { ...item, children }
  }
  return null
}

const { confirm } = Modal

const Logs: React.FC = () => {
  const [searchValue, setSearchValue] = useState('')
  const [treeData, setTreeData] = useState<FileInfo[]>([])
  const [selectKeys, setSelectKeys] = useState<Key[]>([])
  const [log, setLog] = useState('请选择日志文件~')
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const showTreeData = useMemo(() => {
    if (!searchValue) return treeData
    return filterTree(treeData, searchValue)
  }, [searchValue, treeData])

  useEffect(() => init(), [])

  const init = () => {
    getLogs().then((res) => {
      formatMenu(res.data || [])
      setTreeData(res.data || [])
    })
  }

  const formatMenu = (data: (FileInfo & { isLeaf?: boolean })[], path: string = '') => {
    data.forEach((item) => {
      item.key = `${path}/${item.name}`
      if (item.children && item.children.length > 0) formatMenu(item.children, item.key)
      else {
        item.isLeaf = true
        const names = item.name.split('-')
        item.name = `${names.slice(0, 3).join('-')} ${names.slice(3).join(':')}`
      }
    })
  }

  const onSelect: TreeProps['onSelect'] = (keys, { node: { type } }: any) => {
    if (type === 'log' && keys.length > 0) {
      setSelectKeys(keys)
      getLogContent(keys[0] as string).then((res) => {
        setLog(res.data || '')
      })
    }
  }

  const onCheck: TreeProps['onCheck'] = (checked) => setCheckedKeys(checked as string[])

  const confirmDelete = () => {
    confirm({
      title: '确认删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        deleteLogs(checkedKeys).then((res) => {
          setCheckedKeys([])
          message.success(res.message)
          init()
        })
      }
    })
  }

  return (
    <div className={styles.logs}>
      <div className={styles.logs_left}>
        <Input.Search
          className={styles.logs_search}
          placeholder="请输入"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Tree
          className={styles.logs_tree}
          onSelect={onSelect}
          treeData={showTreeData}
          fieldNames={{ title: 'name' }}
          selectedKeys={selectKeys}
          checkable
          onCheck={onCheck}
          checkedKeys={checkedKeys}
        />
        <Button
          className={styles.logs_btn}
          type="primary"
          disabled={checkedKeys.length === 0}
          onClick={confirmDelete}
        >
          删除
        </Button>
      </div>
      <main>
        <pre>{log || '暂无日志'}</pre>
      </main>
    </div>
  )
}

export default Logs
