import { TaskModel } from './../../data/task'
import { removeFalseValue, removeNullValue } from './../../util/index'
import { Op } from 'sequelize'
import PlanService from '../PlanService'
import constant from '../../util/constant'
import { PlanModel } from '../../data/plan'
import { Service } from 'typedi'
import TaskServiceImpl from './TaskServiceImpl'

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
    await PlanModel.update(
      removeNullValue({
        planName: planData.planName,
        cron: planData.cron,
        disable: planData.disable
      }),
      { where: { id: planData.id } }
    )
  }
  public async deletePlan(planId: string) {
    await PlanModel.destroy({ where: { id: planId } })
    await TaskModel.destroy({ where: { planId } })
  }
  public async createPlan(planData: PlanInfo) {
    try {
      // 创建任务
      const createResult = await PlanModel.create(planData)
      const { tasks } = planData
      const { id, planName } = createResult
      // 遍历创建脚本任务
      const taskResult: TaskInfo[] = []
      for (let i = 0; i < (tasks?.length || 0); i++) {
        taskResult.push(
          await TaskModel.create({ planId: id, taskName: `${planName}-${i + 1}`, path: tasks![i] })
        )
      }
      return { ...createResult.dataValues, tasks: taskResult }
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') throw '计划名重复'
      throw error
    }
  }
  public async runPlan(id: string) {
    const planInfo = await PlanModel.findOne({ where: { id }, include: [{ model: TaskModel }] })
    planInfo?.tasks?.forEach((item) => {
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
