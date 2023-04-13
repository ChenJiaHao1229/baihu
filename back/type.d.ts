// 用户数据类型
type UserInfo = {
  id: number
  username: string
  password: string
  token: string
  waitTime: number
  wait: number
  lastLogin: number
  ip: string
  address: string
  createdAt: string
  updatedAt: string
}
// 返回数据格式
type ResponseDataType<T = any> = {
  code: number
  status: boolean
  message?: string
  data?: T
}

// 分页类型
type PaginationType<T = undefined> = {
  current: number // 页号
  pageSize: number // 页大小
  total?: number // 总数
  content?: T[]
}

// 列表查询类型
type SearchListType = {
  current: number // 页号
  pageSize: number // 页大小
  [searchName: string]: string | number | Date | any[]
}

// POST方法多条件查询
type PostSearchListType = {
  params: SearchListType
  sorter: { [sortName: string]: 'ascend' | 'descend' }
  filter: { [filterName: string]: string[] | null }
}

type PlanListResponseType = ResponseDataType<PaginationType<PlanInfo>>

// 计划相关
type PlanInfo = {
  id?: string
  planName?: string // 任务名
  cron?: string // cron表达式
  disable?: boolean // 是否禁用
  lastRunTime?: number // 上一次运行时间
  createdAt?: string // 创建时间
  updatedAt?: string // 修改时间
  tasks?: TaskInfo[] // 管理任务列表
}
// 任务类型
type TaskInfo = {
  id?: string // 脚本id
  planId?: string // 任务id
  taskName?: string // 任务名称
  path?: string // 脚本路径
  status?: number // 状态
  runTime?: number // 运行时间
  plan?: PlanInfo // 关联计划
}

// 修改密码
type updatePwdType = {
  oldPwd: string
  newPwd: string
}

// 文件数据类型
type FileInfo = {
  isFile(): boolean
  isDirectory(): boolean
  isBlockDevice(): boolean
  isCharacterDevice(): boolean
  isSymbolicLink(): boolean
  isFIFO(): boolean
  isSocket(): boolean
  key: string
  name: string
  type: 0 | string // 0为文件夹
  children?: FileInfo[]
}

// 执行脚本任务回调
type TaskCallbacks<T = any, P = any> = {
  onBefore?: (startTime: T) => Promise<void>
  onStart?: (cp: P) => Promise<void>
  onEnd?: (endTime: T, diff: number) => Promise<void>
  onLog?: (message: string) => Promise<void>
  onError?: (message: string) => Promise<void>
}
