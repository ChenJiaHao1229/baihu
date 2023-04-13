import request from '@/api/request'

export const getTaskList = (params: TaskInfo): Promise<ResponseDataType<TaskInfo[]>> => {
  return request({ url: '/task/list', method: 'GET', params })
}
export const runTask = (id: string): Promise<ResponseDataType> => {
  return request({ url: `/task/run/${id}`, method: 'PUT' })
}
export const stopTask = (id: string): Promise<ResponseDataType> => {
  return request({ url: `/task/stop/${id}`, method: 'PUT' })
}
export const addTask = (data: TaskInfo) => {
  return request({ url: `/task`, method: 'POST', data })
}
export const updateTask = (data: TaskInfo): Promise<ResponseDataType> => {
  return request({ url: `/task`, method: 'PUT', data })
}
export const deleteTask = (taskId: string): Promise<ResponseDataType> => {
  return request({ url: `/task/${taskId}`, method: 'DELETE' })
}
