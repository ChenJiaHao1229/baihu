import { TaskModel } from './../../data/task'
import { removeFalseValue, removeNullValue } from './../../util/index'
import { Op, UniqueConstraintError } from 'sequelize'
import PlanService from '../PlanService'
import constant from '../../util/constant'
import { PlanModel } from '../../data/plan'
import { Service } from 'typedi'
import TaskServiceImpl from './TaskServiceImpl'
import nodeSchedule from 'node-schedule'

@Service()
export default class PlanServiceImpl implements PlanService {
  constructor(private taskService: TaskServiceImpl) {}

  public async getPlanList(search: PostSearchListType): Promise<PaginationType<PlanInfo>> {
    // 数据解构
    const {
      params: { pageSize, current, planName, createdAt },
      sorter: { createdAt: createdAtSort },
      filter: { status }
    } = search
    const data = await PlanModel.findAndCountAll(
      removeFalseValue({
        limit: pageSize * 1,
        offset: pageSize * (current - 1),
        // 过滤条件
        where: {
          planName: planName && { [Op.like]: `%${planName || ''}%` },
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
  public async updatePlan(planData: PlanInfo) {
    const { id, planName, cron, disable } = planData
    await PlanModel.update(removeNullValue({ planName, cron, disable }), { where: { id } })
    // 判断是否存在这个定时任务
    if (nodeSchedule.scheduledJobs[String(id)]) {
      // 判断是否修改为禁用
      if (disable) nodeSchedule.scheduledJobs[String(id)].cancel()
      else nodeSchedule.scheduledJobs[String(id)].reschedule(cron!)
    } else if (!disable) {
      // 过不存在定时任务 且状态为非禁用则创建定时任务
      nodeSchedule.scheduleJob(String(id), cron!, () => this.runPlan(id!))
    }
  }
  public async deletePlan(id: string) {
    await PlanModel.destroy({ where: { id } })
    await TaskModel.destroy({ where: { planId: id } })
    nodeSchedule.scheduledJobs[String(id)]?.cancel()
  }
  public async createPlan(planData: PlanInfo) {
    try {
      // 创建任务
      const createResult = await PlanModel.create(planData)
      const { tasks } = planData
      const { id, planName, cron } = createResult
      // 定时运行
      nodeSchedule.scheduleJob(String(id), cron!, () => this.runPlan(id!))
      // 遍历创建脚本任务
      const taskResult: TaskInfo[] = []
      for (let i = 0; i < (tasks?.length || 0); i++) {
        taskResult.push(
          await TaskModel.create({
            planId: id,
            taskName: `${planName}-${i + 1}`,
            path: tasks![i].path
          })
        )
      }
      return { ...createResult.dataValues, tasks: taskResult }
    } catch (error: any) {
      if (error instanceof UniqueConstraintError) throw '计划名重复'
      throw error
    }
  }
  public async runPlan(id: string) {
    console.log('我运行了', id)
    const planInfo = await PlanModel.findOne({ where: { id }, include: [{ model: TaskModel }] })
    planInfo?.tasks?.forEach((item) => {
      // 确保全部遍历 不被失败任务所中断
      try {
        this.taskService.runTask(item.id!)
      } catch (error) {}
    })
  }
  public async stopPlan(id: string) {
    const planInfo = await PlanModel.findOne({ where: { id }, include: [{ model: TaskModel }] })
    planInfo?.tasks?.forEach((item) => {
      try {
        this.taskService.stopTask(item.id!)
      } catch (error) {}
    })
  }
}
