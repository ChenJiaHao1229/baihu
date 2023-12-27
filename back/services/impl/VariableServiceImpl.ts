import { Service } from 'typedi'
import VariableService from '../VariableService'
import { EnvTagModel, VariableModel } from '../../data/variable'
import { removeFalseValue, removeNullValue } from '../../util'
import { Op, UniqueConstraintError } from 'sequelize'
import FileSystemImpl, { FileType } from './FileServiceImpl'
import constant from '../../util/constant'

@Service()
export default class VariableServiceImpl implements VariableService {
  constructor(private fileSystem: FileSystemImpl) {}

  public async getVariableList(): Promise<VariableInfo[]> {
    return await VariableModel.findAll()
  }
  public async getVariable(search: PostSearchListType) {
    // 数据解构
    const {
      params: { pageSize, current, name, envTag }
    } = search
    const data = await VariableModel.findAndCountAll(
      removeFalseValue({
        limit: pageSize * 1,
        offset: pageSize * (current - 1),
        // 过滤条件
        where: {
          name: name && { [Op.like]: `%${name || ''}%` },
          [Op.or]: (envTag as string[])?.map((item) => ({ tagId: item }))
        },
        order: [['weight', 'DESC']],
        include: [{ model: EnvTagModel }]
      })
    )
    return {
      total: data.count,
      current: current,
      pageSize: pageSize,
      content: data.rows
    }
  }
  public async getTagList() {
    return await EnvTagModel.findAll()
  }
  public async addTag(data: EnvTagInfo) {
    try {
      const res = await EnvTagModel.create(data)
      // 保存文件
      this.fileSystem.readFile<EnvTagInfo[]>(constant.tagPath, FileType.JSON).then((tagList) => {
        tagList.push({ id: res.id, name: res.name })
        this.fileSystem.writeFile(constant.tagPath, tagList, FileType.JSON)
      })
      return res
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw '标签名重复'
      throw error
    }
  }
  public async addVariable(data: VariableInfo) {
    try {
      const res = await VariableModel.create(data)
      // 保存文件
      this.fileSystem.readFile<VariableInfo[]>(constant.varPath, FileType.JSON).then((varList) => {
        varList.push({
          id: res.id,
          name: res.name,
          tagId: res.tagId,
          value: res.value,
          weight: res.weight
        })
        this.fileSystem.writeFile(constant.varPath, varList, FileType.JSON)
      })
      return res
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw '数据重复'
      throw error
    }
  }
  public async updateVariable(data: VariableInfo) {
    try {
      const { id, value, name, weight, tagId } = data
      await VariableModel.update(removeNullValue({ value, name, weight, tagId }), {
        where: { id }
      })
      // 修改文件
      this.fileSystem.readFile<VariableInfo[]>(constant.varPath, FileType.JSON).then((varList) => {
        varList.some((item) => {
          if (item.id === id) {
            item.name = name
            item.value = value
            item.weight = weight
            item.tagId = tagId
            return true
          } else return false
        })
        this.fileSystem.writeFile(constant.varPath, varList, FileType.JSON)
      })
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw '数据重复'
      throw error
    }
  }
  public async deleteVariable(id: string) {
    await VariableModel.destroy({ where: { id } })
    // 删除文件中的数据
    this.fileSystem.readFile<VariableInfo[]>(constant.varPath, FileType.JSON).then((varList) => {
      varList = varList.filter((item) => item.id !== id)
      this.fileSystem.writeFile(constant.varPath, varList, FileType.JSON)
    })
  }
}
