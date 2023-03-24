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
  FolderOutlined,
  HomeOutlined
} from '@ant-design/icons'
import { PageHeader } from '@ant-design/pro-components'
import { Button, Modal, Dropdown, Menu, message, Select } from 'antd'
import { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import styles from './index.module.less'
import constant from '@/utils/constant'
import AddFile from './AddFile'

const { confirm } = Modal

const Script: React.FC = () => {
  const [files, setFiles] = useState<FileInfo[]>([]) // 左侧菜单所有数据
  const [isEdit, setIsEdit] = useState<boolean>(false) // 编辑器是否可编辑
  const [activeKey, setActiveKey] = useState<string>('') // 选择的文件夹key
  const [breadcrumbItems, setBreadcrumbItems] = useState<FileInfo[]>([]) // 面包屑
  const [menuItems, setMenuItems] = useState<FileInfo[]>([]) // 左侧菜单栏
  const [theme, setTheme] = useState(constant.monacoThere[0].value) // 编辑器主题
  const [language, setLanguage] = useState(constant.monacoLanguage[0].value) // 编辑器语言
  const [addDirOpen, setAddDirOpen] = useState<boolean>(false) // 新增/编辑弹窗
  const [operation, setOperation] = useState<FileInfo>() // 操作项数据
  const [editFile, setEditFile] = useState<FileInfo & { content: string }>() // 编辑中的文件数据
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()

  useEffect(() => {
    getScriptMenu()
  }, [])
  // 监听选择的文件夹变化 变换重新计算
  useEffect(() => {
    if (!activeKey) {
      setMenuItems(files)
      setBreadcrumbItems([])
      return
    }
    if (files.length === 0) return
    let menuData = files
    const breadcrumbData: FileInfo[] = []
    // 遍历查询目录
    activeKey.split('-').forEach((item) => {
      breadcrumbData.push(menuData[parseInt(item)])
      menuData = menuData[parseInt(item)].children || []
    })
    setBreadcrumbItems(breadcrumbData)
    setMenuItems(menuData)
  }, [activeKey, files])

  // 获取目录数据
  const getScriptMenu = () => {
    getScriptList().then((res) => {
      if (res.status) {
        formatRes(res.data!)
        // 对打开的文件 key进行更新
        if (editFile) {
          // 先遍历查询到目录
          let menuData = files
          activeKey
            .split('-')
            .slice(0, -1)
            .forEach((item) => {
              menuData = menuData[parseInt(item)].children || []
            })
          // 通过名字查找
          const file = menuData.find((item) => item.name === editFile.name)
          if (file) {
            setEditFile({ ...editFile, key: file.key })
          }
        }
        setFiles(res.data!)
      }
    })
  }

  // 为文件列表添加唯一key
  const formatRes = (data: FileInfo[], key?: string) => {
    data.forEach((item, index) => {
      item.key = key ? `${key}-${index}` : `${index}`
      if (item.children && item.children.length > 0) formatRes(item.children, item.key)
    })
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
          <Dropdown
            trigger={['contextMenu']}
            // 下拉菜单
            menu={getDropdownMenu(item)}
          >
            <div
              className={styles.menuItem}
              onDoubleClick={() => {
                // 判断点击的是文件还是文件夹
                if (item.type) setActiveKey(item.key)
                else if (editorRef.current) openFile(item)
                else message.warning('请等待组件加载成功~')
              }}
            >
              {item.type ? <FolderOutlined /> : <FileTextOutlined />}&nbsp;&nbsp;
              {item.name}
            </div>
          </Dropdown>
        ),
        title: item.name
      }))
    ]
  }
  // 获取面包屑
  const getbreadcrumbItems = () => {
    return {
      items: [
        {
          title: <HomeOutlined className="pointer" onClick={() => setActiveKey('')} />,
          key: 'dir-home'
        },
        ...breadcrumbItems.map((item) => ({
          title: <span onClick={() => setActiveKey(item.key)}>{item.name}</span>,
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
            <span
              onClick={() => {
                setAddDirOpen(true)
                setOperation(file)
              }}
            >
              重命名
            </span>
          ),
          key: 'rename'
        },
        {
          label: <span onClick={() => deleteConfirm(file)}>删除</span>,
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
  const handleAdd = async (
    { name, type }: { name: string; type: number },
    setLoading: (loading: boolean) => any
  ) => {
    if (!name) {
      message.warning('文件名不能为空！')
      return
    }
    try {
      setLoading(true)
      const path = getPath()
      // 判断是编辑还是新增
      if (operation) {
        const res = await renameDir({ oldName: path + operation.name, newName: path + name })
        if (res.status) {
          message.success(res.message)
          setAddDirOpen(false)
          // 判断修改的文件是否为当前打开文件 如果是则需要更新编辑存储数据
          if (operation && operation.key === editFile?.key) setEditFile({ ...editFile!, name })
        } else {
          message.error(res.message)
        }
      } else {
        const res = await createFile({ name: path + name, type })
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
    confirm({
      title: '确认删除？',
      content: file.type !== 0 && file?.children?.length! > 0 && '子文件也会被删除',
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
              name: editFile?.name!,
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
    getFileContent({ name: path + file.name }).then((res) => {
      if (res.status) {
        editorRef.current?.setValue(res.data)
        setEditFile({ ...file, content: res.data })
      } else message.error(res.message)
    })
  }
  return (
    <div className={styles.script}>
      <Menu className={styles.side} selectable={false} items={getMenuItems()} />
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
