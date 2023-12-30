import request from '../request'

// 获取目录列表
export const getLogs = (): Promise<ResponseDataType<FileInfo[]>> => {
  return request({ url: '/logs/list', method: 'GET' })
}
// 获取目录列表
export const getLogContent = (path: string): Promise<ResponseDataType<string>> => {
  return request({ url: '/logs', method: 'GET', params: { path } })
}
// 删除日志
export const deleteLogs = (data: string[]): Promise<ResponseDataType<boolean>> => {
  return request({ url: '/logs', method: 'DELETE', data })
}
// 查看最新日志
export const getLatestLogContent = (path: string): Promise<ResponseDataType<string>> => {
  return request({ url: '/logs/latest', method: 'GET', params: { path } })
}
