import fs from 'fs'
import Logger from '../logger'
import constant from '../constant'
import Container from 'typedi'
import VariableServiceImpl from '../../services/impl/VariableServiceImpl'

export default async () => {
  const variableService = Container.get(VariableServiceImpl)
  try {
    const varList = await variableService.getVariableList()
    const tagList = await variableService.getTagList()
    fs.writeFileSync(
      constant.varPath,
      JSON.stringify(
        varList
          .map(({ id, name, tagId, value, weight }) => ({ id, name, tagId, value, weight }))
          .sort((a, b) => (b.weight || 0) - (a.weight || 0))
      )
    )
    fs.writeFileSync(
      constant.tagPath,
      JSON.stringify(tagList.map(({ id, name }) => ({ id, name })))
    )
    Logger.info('✌️ 初始化数据成功！')
  } catch (error) {
    Logger.error(`✊ 初始化数据失败： ${error}`)
  }
}
