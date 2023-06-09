import request from '../request'

type FileParams = { name: string; type?: number | string; content?: string }

// 获取目录列表
export const getScriptAllList = (): Promise<ResponseDataType<FileInfo[]>> => {
  return request({ url: '/script/alllist', method: 'GET' })
}
// 获取目录列表
export const getScriptList = (params: FileParams): Promise<ResponseDataType<FileInfo[]>> => {
  return request({ url: '/script/list', method: 'GET', params })
}
// 创建目录
export const createFile = (data: FileParams): Promise<ResponseDataType> => {
  return request({ url: '/script/file', method: 'POST', data })
}
// 重命名文件
export const renameDir = (data: {
  oldName: string
  newName: string
}): Promise<ResponseDataType> => {
  return request({ url: '/script/rename', method: 'PUT', data })
}
// 删除文件
export const deleteFile = (data: FileParams): Promise<ResponseDataType> => {
  return request({ url: '/script/file', method: 'DELETE', data })
}
// 获取文件内容
export const getFileContent = (params: FileParams): Promise<ResponseDataType> => {
  return request({ url: '/script/file', method: 'GET', params })
}
// 获取文件内容
export const updateFileContent = (data: FileParams): Promise<ResponseDataType> => {
  return request({ url: '/script/file', method: 'PUT', data })
}
