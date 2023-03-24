import request from '@/api/request'

export const createTask = (data: TaskInfo): Promise<TaskListResponseType> => {
  return request({ url: '/task/task', method: 'POST', data })
}
export const getTaskList = (data: PostSearchListType): Promise<TaskListResponseType> => {
  return request({ url: '/task/tasklist', method: 'POST', data })
}

export const updateTask = (id: string, data: PostSearchListType): Promise<TaskListResponseType> => {
  return request({ url: `/task/task/${id}`, method: 'PUT', data })
}
