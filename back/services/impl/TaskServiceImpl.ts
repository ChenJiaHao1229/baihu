import { TaskModel } from './../../data/task'
import TaskService from '../TaskService'

export default class TaskServiceImpl implements TaskService {
  public async getTaskList(search: TaskInfo): Promise<TaskInfo[]> {
    // 数据解构
    const { planId } = search
    console.log(11, planId)

    const data = await TaskModel.findAll({ where: { planId } })
    return data
  }
}
