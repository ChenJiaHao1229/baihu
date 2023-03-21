// 用户数据类型
type UserInfo = {
  username: string
  password: string
  wait: number
  lastLogin: number
  ip: string
  address: string
  token: string
  waitTime: number
}
// 返回数据格式
type ResponseDataType<T = undefined> = {
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

type TaskListResponseType = ResponseDataType<PaginationType<TaskInfo>>

// 任务相关
type TaskInfo = {
  id?: string
  taskName?: string // 任务名
  cron?: string // cron表达式
  status?: number // 任务状态
  createdAt?: string // 创建时间
  updatedAt?: string // 修改时间
  lastRunTime?: number // 上一次运行时间
  runTime?: number // 运行花费时间
}
