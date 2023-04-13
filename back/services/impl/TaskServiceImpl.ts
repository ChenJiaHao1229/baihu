import { TaskModel } from './../../data/task'
import TaskService from '../TaskService'
import { Service, Inject } from 'typedi'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import path from 'path'
import constant from '../../util/constant'
import dayjs from 'dayjs'
import { getFileType, removeNullValue } from '../../util'
import { PlanModel } from '../../data/plan'
import FileSystemImpl from './FileServiceImpl'
import treeKill from 'tree-kill'

@Service()
export default class TaskServiceImpl implements TaskService {
  private taskMap = new Map<string, ChildProcessWithoutNullStreams>()

  constructor(private fileSystem: FileSystemImpl) {}

  public async getTaskList(search: TaskInfo): Promise<TaskInfo[]> {
    // 数据解构
    const { planId } = search
    const data = await TaskModel.findAll({ where: { planId } })
    return data
  }

  public async runTask(id: string) {
    try {
      const data = await TaskModel.findOne({
        where: { id },
        include: [{ model: PlanModel }]
      })
      if (data) {
        const { path: scriptPath } = data
        const type = getFileType(scriptPath!)
        // 判断是否支持该类型文件
        if (!constant.runScript[type]) throw '该文件无法运行'
        const startTime = dayjs()
        const taskCallBacks = this.taskCallBacks(data)
        // 捕获线程运行报错
        try {
          await taskCallBacks.onBefore?.(startTime)
          const child = spawn('npx.cmd', [
            constant.runScript[type],
            path.join(constant.scriptPath, scriptPath || '')
          ])
          await taskCallBacks.onStart?.(child)
          // 子线程事件监听
          child.stdout.on('data', async (chunk) => await taskCallBacks.onLog?.(chunk.toString()))
          child.stderr.on('data', async (chunk) => await taskCallBacks.onError?.(chunk.toString()))
          child.on('close', async () => {
            const endTime = dayjs()
            await taskCallBacks.onEnd?.(endTime, endTime.diff(startTime, 'seconds'))
          })
        } catch (error) {
          await taskCallBacks.onError?.(JSON.stringify(error))
        }
      } else throw '任务不存在'
    } catch (error) {
      throw error
    }
  }
  public async stopTask(id: string) {
    if (this.taskMap.has(id.toString())) {
      const pid = this.taskMap.get(id.toString())?.pid
      pid && treeKill(pid)
      this.taskMap.delete(id.toString())
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
    try {
      const { taskName, path, status, runTime } = taskInfo
      await TaskModel.update(removeNullValue({ taskName, path, status, runTime }), {
        where: { id: taskInfo.id }
      })
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') throw '任务名重复'
      throw error
    }
  }

  private taskCallBacks(
    task: TaskInfo
  ): TaskCallbacks<dayjs.Dayjs, ChildProcessWithoutNullStreams> {
    let logPath = ''
    return {
      onBefore: async (startTime) => {
        const logTime = startTime.format('YYYY-MM-DD-HH-mm-ss')
        logPath = path.join(
          constant.logPath,
          `${task.plan?.planName}/${task.taskName}/${logTime}.log`
        )
        await this.fileSystem.make(
          logPath,
          1,
          `## 开始执行... ${startTime.format('YYYY-MM-DD HH:mm:ss')}\n`
        )
      },
      onStart: async (child) => {
        // 判断该任务是否在运行
        this.taskMap.has(task.id!.toString()) && this.taskMap.get(task.id!.toString())?.kill()
        this.taskMap.set(task.id!.toString(), child)
        task.status = 1
        await TaskModel.update({ status: 1 }, { where: { id: task.id } })
      },
      onEnd: async (endTime, diff) => {
        this.fileSystem.appendFile(
          logPath,
          `\n## 执行结束... ${endTime.format('YYYY-MM-DD HH:mm:ss')}  耗时 ${diff} 秒`
        )
        this.taskMap.delete(task.id!.toString())
        // 正常运行结束则修改
        if (task.status === 1) await TaskModel.update({ status: 0 }, { where: { id: task.id } })
      },
      onError: async (message: string) => {
        task.status = 2
        await TaskModel.update({ status: 2 }, { where: { id: task.id } })
        this.fileSystem.appendFile(logPath, `\n${message}`)
      },
      onLog: async (message: string) => {
        this.fileSystem.appendFile(logPath, `\n${message}`)
      }
    }
  }
}
