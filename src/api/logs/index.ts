import request from '../request'

// 获取目录列表
export const getLogs = (): Promise<ResponseDataType<FileInfo[]>> => {
  return request({ url: '/logs/list', method: 'GET' })
}
// 获取目录列表
export const getLogContent = (path: string): Promise<ResponseDataType<string>> => {
  return request({ url: '/logs', method: 'GET', params: { path } })
}
