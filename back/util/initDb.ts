import { TaskModel } from './../data/task'
import Logger from './logger'
import { SettingModel } from '../data/setting'
import { AuthModel } from '../data/auth'

export default async () => {
  try {
    await AuthModel.sync()
    await SettingModel.sync()
    await TaskModel.sync()

    // 初始化表格数据
    if ((await AuthModel.count()) === 0) {
      await AuthModel.create({ username: 'admin', password: 'admin' })
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
