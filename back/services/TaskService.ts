export default interface TaskService {
  getTaskList: (pageData: PostSearchListType) => Promise<PaginationType<TaskInfo>>

  updateTask: (taskId: string, taskData: TaskInfo) => Promise<ResponseDataType>

  deleteTask: (taskId: string) => Promise<ResponseDataType>

  createTask: (taskData: TaskInfo) => void
}
