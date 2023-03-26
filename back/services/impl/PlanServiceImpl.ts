import { TaskModel } from './../../data/task'
import { removeNullValue } from './../../util/index'
import { Op } from 'sequelize'
import PlanService from '../PlanService'
import constant from '../../util/constant'
import { PlanModel } from '../../data/plan'

export default class PlanServiceImpl implements PlanService {
  public async getPlanList(search: PostSearchListType): Promise<PaginationType<PlanInfo>> {
    // 数据解构
    const {
      params: { pageSize, current, planName, createdAt },
      sorter: { createdAt: createdAtSort },
      filter: { status }
    } = search
    const data = await PlanModel.findAndCountAll(
      removeNullValue({
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
  public async updatePlan(planId: string, planData: PlanInfo): Promise<ResponseDataType> {
    return {
      code: 200,
      status: true
    }
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
        taskResult.push(await TaskModel.create({ planId: id, taskName: planName, path: tasks![i] }))
      }
      return { ...createResult.dataValues, tasks: taskResult }
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') throw '任务名重复'
      throw error
    }
  }
}
