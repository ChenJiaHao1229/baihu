import request from '@/api/request'

export const createTask = (data: TaskInfo): Promise<TaskListResponseType> => {
  return request({
    url: '/createTask',
    method: 'POST',
    data
  })
}
export const getTaskList = (data: PostSearchListType): Promise<TaskListResponseType> => {
  return request({
    url: '/getTaskList',
    method: 'POST',
    data
  })
}

export const updateTask = (id: string, data: PostSearchListType): Promise<TaskListResponseType> => {
  return request({
    url: `/updateTask/${id}`,
    method: 'PUT',
    data
  })
}
