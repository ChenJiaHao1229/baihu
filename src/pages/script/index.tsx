import {
  createFile,
  deleteFile,
  getFileContent,
  getScriptList,
  renameDir,
  updateFileContent
} from '@/api/script'
import {
  ExclamationCircleFilled,
  FileTextOutlined,
  FolderOpenOutlined,
  HomeOutlined
} from '@ant-design/icons'
import { PageHeader } from '@ant-design/pro-components'
import { Button, Modal, Dropdown, Menu, message, Select, Spin, Tooltip } from 'antd'
import { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import styles from './index.module.less'
import constant from '@/utils/constant'
import AddFile from './AddFile'

const { confirm } = Modal

const Script: React.FC = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false) // 编辑器是否可编辑
  const [breadcrumbItems, setBreadcrumbItems] = useState<FileInfo[]>([]) // 面包屑
  const [menuItems, setMenuItems] = useState<FileInfo[]>([]) // 左侧菜单栏
  const [theme, setTheme] = useState(constant.monacoThere[0].value) // 编辑器主题
  const [language, setLanguage] = useState(constant.monacoLanguage[0].value) // 编辑器语言
  const [addDirOpen, setAddDirOpen] = useState<boolean>(false) // 新增/编辑弹窗
  const [operation, setOperation] = useState<FileInfo>() // 操作项数据
  const [editFile, setEditFile] = useState<FileInfo & { content: string }>() // 编辑中的文件数据
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()
  const [menuLoading, setMenuLoading] = useState<boolean>(false) // 菜单加载控制

  // 监听面包屑变化
  useEffect(() => {
    getScriptMenu()
  }, [breadcrumbItems])

  // 获取目录数据
  const getScriptMenu = () => {
    setMenuLoading(true)
    getScriptList({ name: getPath() })
      .then((res) => {
        if (res.status) {
          formatRes(res.data!)
          setMenuItems(res.data!)
        }
      })
      .finally(() => setMenuLoading(false))
  }

  // 为文件列表添加唯一key
  const formatRes = (data: FileInfo[]) => {
    const path = getPath()
    data.forEach((item) => (item.key = path + item.name))
  }

  // 获取menu菜单
  const getMenuItems = () => {
    return [
      {
        key: 'add-dir-btn',
        label: (
          <Button
            type="primary"
            style={{ width: '100%' }}
            onClick={() => {
              setAddDirOpen(true)
              setOperation(undefined)
            }}
          >
            新建
          </Button>
        )
      },
      // 一定需要写这里根据state重新渲染
      ...menuItems.map((item) => ({
        key: item.key,
        label: (
          <Tooltip title={item.name}>
            <Dropdown
              trigger={['contextMenu']}
              // 下拉菜单
              menu={getDropdownMenu(item)}
            >
              <div
                className={`${styles.menuItem} ellipsis`}
                onDoubleClick={() => {
                  // 判断点击的是文件还是文件夹
                  if (item.type === 0) setBreadcrumbItems([...breadcrumbItems, item])
                  else if (editorRef.current) openFile(item)
                  else message.warning('请等待组件加载成功~')
                }}
              >
                {item.type === 0 ? (
                  <FolderOpenOutlined />
                ) : (
                  constant.fileInfo[item.type]?.icon || <FileTextOutlined />
                )}
                &nbsp;&nbsp;{item.name}
              </div>
            </Dropdown>
          </Tooltip>
        )
      }))
    ]
  }
  // 获取面包屑
  const getbreadcrumbItems = () => {
    return {
      items: [
        {
          title: <HomeOutlined className="pointer" onClick={() => setBreadcrumbItems([])} />,
          key: 'dir-home'
        },
        ...breadcrumbItems.map((item) => ({
          title: (
            <span
              onClick={() =>
                // 通过 / 来截取指定长度的面包屑
                setBreadcrumbItems(breadcrumbItems.slice(0, item.key.split('/').length - 1))
              }
            >
              {item.name}
            </span>
          ),
          key: item.key
        }))
      ]
    }
  }
  // 获取下拉菜单
  const getDropdownMenu = (file: FileInfo) => {
    return {
      items: [
        {
          label: (
            <div
              onClick={() => {
                // 判断点击的是文件还是文件夹
                if (file.type === 0) setBreadcrumbItems([...breadcrumbItems, file])
                else if (editorRef.current) openFile(file)
                else message.warning('请等待组件加载成功~')
              }}
              className={styles.menuItem}
            >
              打开
            </div>
          ),
          key: 'open'
        },
        {
          label: (
            <div
              onClick={() => {
                setAddDirOpen(true)
                setOperation(file)
              }}
              className={styles.menuItem}
            >
              重命名
            </div>
          ),
          key: 'rename'
        },
        {
          label: (
            <div onClick={() => deleteConfirm(file)} className={styles.menuItem}>
              删除
            </div>
          ),
          key: 'del'
        }
      ]
    }
  }

  // 获取当前路径
  const getPath = () => {
    let path = '/'
    breadcrumbItems.forEach((item) => (path += `${item.name}/`))
    return path
  }

  // 创建弹窗回调函数
  const handleAdd = async (file: FileInfo, setLoading: (loading: boolean) => any) => {
    try {
      setLoading(true)
      const path = getPath()
      // 判断是编辑还是新增
      if (operation) {
        const res = await renameDir({ oldName: path + operation.name, newName: path + file.name })
        if (res.status) {
          message.success(res.message)
          setAddDirOpen(false)
          // 判断修改的文件是否为当前打开的文件
          if (file.key === operation.key)
            setEditFile({ ...editFile!, name: file.name, key: path + file.name })
          setMenuItems(
            menuItems.map((item) => {
              if (item.key === file.key) {
                return { ...item!, name: file.name, key: path + file.name }
              } else return item
            })
          )
        } else {
          message.error(res.message)
        }
      } else {
        const res = await createFile({ name: path + file.name, type: file.type })
        if (res.status) {
          message.success(res.message)
          setAddDirOpen(false)
          getScriptMenu()
        } else {
          message.error(res.message)
        }
      }
    } finally {
      setLoading(false)
    }
  }
  // 确认删除
  const deleteConfirm = (file: FileInfo) => {
    if (file.key === editFile?.key) {
      message.warning('当前文件打开中，无法删除')
      return
    }
    confirm({
      title: '确认删除？',
      content: file.type === 0 && '子文件也会被删除',
      icon: <ExclamationCircleFilled />,
      onOk() {
        const path = getPath()
        deleteFile({ name: path + file.name, type: file.type }).then((res) => {
          if (res.status) getScriptMenu()
        })
      }
    })
  }
  // 操作按钮组
  const getBtnGroup = () => {
    return [
      isEdit && (
        <Button
          key="save"
          type="primary"
          onClick={() => {
            updateFileContent({
              name: editFile?.key!,
              content: editorRef.current?.getValue()!
            }).then((res) => {
              if (res.status) {
                setIsEdit(false)
                setEditFile({ ...editFile!, content: editorRef.current?.getValue() || '' })
                message.success(res.message)
              } else message.error(res.message)
            })
          }}
        >
          保存
        </Button>
      ),
      isEdit && (
        <Button
          key="cancel"
          onClick={() => {
            setIsEdit(false)
            editorRef.current?.setValue(editFile?.content || '')
          }}
        >
          取消
        </Button>
      ),
      !isEdit && (
        <Button key="edit" type="primary" disabled={!editFile} onClick={() => setIsEdit(true)}>
          编辑
        </Button>
      )
      // <Button key="diff">对比</Button>
    ]
  }

  // 打开文件
  const openFile = (file: FileInfo) => {
    // 编辑状态下不允许打开其他文件
    if (isEdit) {
      message.warning('请先保存当前文件')
      return
    }
    const path = getPath()
    editorRef.current?.setValue('加载中...')
    getFileContent({ name: path + file.name }).then((res) => {
      if (res.status) {
        editorRef.current?.setValue(res.data)
        setEditFile({ ...file, content: res.data })
        setLanguage(constant.fileInfo[file.type].language)
      } else message.error(res.message)
    })
  }
  return (
    <div className={styles.script}>
      {menuLoading ? (
        <div className={`${styles.side} ${styles.sideLoading}`}>
          <Spin tip="加载中..." size="large" />
        </div>
      ) : (
        <Menu className={styles.side} selectedKeys={[editFile?.key || '']} items={getMenuItems()} />
      )}
      <div className={styles.content}>
        <PageHeader
          title={editFile?.name || '暂未打开文件'}
          breadcrumb={getbreadcrumbItems()}
          extra={getBtnGroup()}
          className={styles.header}
        />
        <div className={styles.setting}>
          <div className={styles.language}>
            <span>语言</span>
            <Select
              className={styles.select}
              options={constant.monacoLanguage}
              onSelect={setLanguage}
              value={language}
            />
          </div>
          <div className={styles.theme}>
            <span>主题</span>
            <Select
              className={styles.select}
              options={constant.monacoThere}
              onSelect={setTheme}
              value={theme}
            />
          </div>
        </div>
        <Editor
          className={styles.editor}
          defaultValue="请选择文件~"
          language={language}
          height={'100%'}
          options={{
            theme: theme, // 编辑器主题颜色'vs' (default), 'vs-dark', 'hc-black'
            readOnly: !isEdit, //是否只读  取值 true | false
            fontSize: 14,
            tabSize: 2
          }}
          onMount={(editor: monaco.editor.IStandaloneCodeEditor) => (editorRef.current = editor)}
        />
      </div>
      <AddFile open={addDirOpen} setOpen={setAddDirOpen} data={operation} onOk={handleAdd} />
    </div>
  )
}

export default Script
