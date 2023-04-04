export default interface TaskService {
  getTaskList: (pageData: TaskInfo) => Promise<TaskInfo[]>

  runTask: (id: string) => void

  stopTask: (id: string) => void

  addTask: (data: TaskInfo) => Promise<TaskInfo>

  deleteTask: (taskId: string) => void

  updateTask: (taskInfo: TaskInfo) => void
}
