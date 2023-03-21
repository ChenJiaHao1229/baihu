import { removeNullValue } from './../../util/index'
import { Op } from 'sequelize'
import TaskService from '../TaskService'
import constant from '../../util/constant'
import { TaskModel } from '../../data/task'

export default class TaskServiceImpl implements TaskService {
  public async getTaskList(search: PostSearchListType): Promise<PaginationType<TaskInfo>> {
    // 数据解构
    const {
      params: { pageSize, current, taskName, createdAt },
      sorter: { createdAt: createdAtSort },
      filter: { status }
    } = search
    const data = await TaskModel.findAndCountAll(
      removeNullValue({
        limit: pageSize * 1,
        offset: pageSize * (current - 1),
        // 过滤条件
        where: {
          taskName: taskName && { [Op.like]: `%${taskName || ''}%` },
          createdAt: createdAt && { [Op.between]: createdAt as [string, string] },
          [Op.or]: status && status.map((item) => ({ status: item }))
        },
        order: createdAtSort && [['createdAt', constant.sorter[createdAtSort]]]
      })
    )
    return {
      total: data.count,
      current: current,
      pageSize: pageSize,
      content: data.rows
    }
  }
  public async updateTask(taskId: string, taskData: TaskInfo): Promise<ResponseDataType> {
    return {
      code: 200,
      status: true
    }
  }
  public async deleteTask(taskId: string): Promise<ResponseDataType> {
    return {
      code: 200,
      status: true
    }
  }
  public async createTask(taskData: TaskInfo) {
    return await TaskModel.create(taskData)
  }
}
