import { TaskModel } from './../../data/task'
import TaskService from '../TaskService'
import { Service } from 'typedi'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import path from 'path'
import constant from '../../util/constant'
import dayjs from 'dayjs'
import { removeNullValue } from '../../util'

@Service()
export default class TaskServiceImpl implements TaskService {
  public async stopTask(id: string) {}
  public async getTaskList(search: TaskInfo): Promise<TaskInfo[]> {
    // 数据解构
    const { planId } = search
    const data = await TaskModel.findAll({ where: { planId } })
    return data
  }

  public async runTask(id: string) {
    try {
      const data = await TaskModel.findOne({ where: { id } })
      if (data) {
        const { path: scriptPath } = data
        const child = spawn(`node ${path.join(constant.scriptPath, scriptPath || '')}`, {
          shell: true
        })

        child.stdout.on('data', (chunk) => {
          console.log(1, chunk.toString())
          child.pid && process.kill(child.pid, 14)
        })
        child.stderr.on('data', (chunk) => {
          console.log(11, chunk.toString())
        })
        child.on('error', (err) => {
          console.log(2, err)
        })
        child.on('close', (code, signal) => {
          console.log(3, code, signal)
        })
        child.on('exit', (code, signal) => {
          console.log(4, code, signal)
        })
      } else throw '任务不存在'
    } catch (error) {
      console.log(2222, error)
    }
  }

  public async addTask(data: TaskInfo): Promise<TaskInfo> {
    try {
      return await TaskModel.create(data)
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') throw '添加重复！'
      throw error
    }
  }

  public async deleteTask(taskId: string) {
    await TaskModel.destroy({ where: { id: taskId } })
  }
  public async updateTask(taskInfo: TaskInfo) {
    await TaskModel.update(removeNullValue({ taskName: taskInfo.taskName, path: taskInfo.path }), {
      where: { id: taskInfo.id }
    })
  }

  private taskCallBacks(): TaskCallbacks<dayjs.Dayjs, ChildProcessWithoutNullStreams> {
    return {
      onBefore: async (startTime) => {},
      onStart: async (cp, startTime) => {},
      onEnd: async (cp, endTime, diff) => {},
      onError: async (message: string) => {},
      onLog: async (message: string) => {}
    }
  }
}
