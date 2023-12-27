import fs from 'fs'
import Logger from '../logger'
import constant from '../constant'
import initData from './initData'

export default async () => {
  try {
    // 判断data文件夹是否存在
    const dataDirExist = await fileExist(constant.dataPath)
    // 判断script文件夹是否存在
    const scriptDirExist = await fileExist(constant.scriptPath)
    // 判断log文件夹是否存在
    const logDirExist = await fileExist(constant.logPath)
    // 判断db文件夹是否存在
    const dbDirExist = await fileExist(constant.dbPath)

    // 创建文件
    if (!dataDirExist) {
      fs.mkdirSync(constant.dataPath)
    }
    if (!scriptDirExist) {
      fs.mkdirSync(constant.scriptPath)
    }
    if (!logDirExist) {
      fs.mkdirSync(constant.logPath)
    }
    if (!dbDirExist) {
      fs.mkdirSync(constant.dbPath)
    }
    Logger.info('✌️ 文件初始化成功！')

    await initData()
  } catch (error) {
    Logger.error(`✊ ${error}`)
  }
}

const fileExist = async (file: fs.PathLike) => {
  return new Promise((resolve) => {
    try {
      fs.accessSync(file)
      resolve(true)
    } catch (error) {
      resolve(false)
    }
  })
}
