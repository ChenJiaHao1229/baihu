import { DataNode, DirectoryTreeProps } from 'antd/es/tree'
import React, { Key, useEffect, useState } from 'react'
import { Tree } from 'antd'
import { getLogContent, getLogs } from '@/api/logs'
import styles from './index.module.less'

const { DirectoryTree } = Tree

const Logs: React.FC = () => {
  const [treeData, setTreeData] = useState<DataNode[]>([])
  const [selectKeys, setSelectKeys] = useState<Key[]>([])
  const [log, setLog] = useState('请选择日志文件~')

  useEffect(() => {
    getLogs().then((res) => {
      if (res.status) {
        formatMenu(res.data || [])
        setTreeData(res.data || [])
      }
    })
  }, [])

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

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, { node: { type } }: any) => {
    if (type === 'log') {
      setSelectKeys(keys)
      getLogContent(keys[0] as string).then((res) => {
        setLog(res.data || '')
      })
    }
  }
  return (
    <div className={styles.logs}>
      <DirectoryTree
        onSelect={onSelect}
        treeData={treeData}
        fieldNames={{ title: 'name' }}
        selectedKeys={selectKeys}
        style={{ overflow: 'scroll' }}
      />
      <main>
        <pre>{log}</pre>
      </main>
    </div>
  )
}

export default Logs
