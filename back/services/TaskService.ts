export default interface TaskService {
  getTaskList: (pageData: TaskInfo) => Promise<TaskInfo[]>
}
