import fs from 'fs'
import Logger from './logger'
import constant from './constant'

export default async () => {
  try {
    // 判断data文件夹是否存在
    const dataDirExist = await fileExist(constant.dataPath)
    // 判断script文件夹是否存在
    const scriptDirExist = await fileExist(constant.scriptPath)
    // 判断log文件夹是否存在
    const logDirExist = await fileExist(constant.logPath)

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

    Logger.info('✌️ 文件初始化成功！')
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
