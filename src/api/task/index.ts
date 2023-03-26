import request from '@/api/request'

export const getTaskList = (params: TaskInfo): Promise<ResponseDataType<TaskInfo[]>> => {
  return request({ url: '/task/list', method: 'GET', params })
}
