import Container from 'typedi'
import Logger from '../logger'
import PlanServiceImpl from '../../services/impl/PlanServiceImpl'
import nodeSchedule from 'node-schedule'

export default async () => {
  const planService = Container.get(PlanServiceImpl)
  try {
    const planList = await planService.getEnablePlanList()
    // 清空所有任务
    for (const job in nodeSchedule.scheduledJobs) job && nodeSchedule.scheduledJobs[job].cancel()
    // 添加所有任务
    planList.forEach((item) =>
      // 定时运行
      nodeSchedule.scheduleJob(String(item.id), item.cron!, () => planService.runPlan(item.id!))
    )
    Logger.info('✌️ 初始化任务成功！')
  } catch (error) {
    Logger.error(`✊初始化任务失败： ${error}`)
  }
}
