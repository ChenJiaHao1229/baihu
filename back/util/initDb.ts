import { PlanModel } from './../data/plan'
import { TaskModel } from './../data/task'
import Logger from './logger'
import { SettingModel } from '../data/setting'
import { AuthModel } from '../data/auth'
import constant from './constant'

export default async () => {
  try {
    await AuthModel.sync()
    await SettingModel.sync()
    await PlanModel.sync()
    await TaskModel.sync()

    // 建立关联关系
    PlanModel.hasMany(TaskModel, { foreignKey: 'planId' })
    TaskModel.belongsTo(PlanModel, { foreignKey: 'planId' })

    // 初始化表格数据
    if ((await AuthModel.count()) === 0) {
      // 账号密码初始化为 admin
      await AuthModel.create(constant.userInfo)
    }
    if ((await SettingModel.count()) === 0) {
      await SettingModel.bulkCreate([
        {
          key: 'theme',
          value: {
            layout: 'side',
            navTheme: 'light',
            contentWidth: 'Fluid',
            fixSiderbar: true,
            colorPrimary: '#1677FF'
          }
        }
      ])
    }
    Logger.info('✌️ 数据库模型同步完成')
  } catch (error) {
    Logger.error(`✊ ${error}`)
  }
}
