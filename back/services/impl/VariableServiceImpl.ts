import { Service } from 'typedi'
import VariableService from '../VariableService'
import { EnvTagModel, VariableModel } from '../../data/variable'
import { removeFalseValue, removeNullValue } from '../../util'
import { Op, UniqueConstraintError } from 'sequelize'

@Service()
export default class VariableServiceImpl implements VariableService {
  public async getVariable(search: PostSearchListType) {
    // 数据解构
    const {
      params: { pageSize, current, varName, envTag }
    } = search
    const data = await VariableModel.findAndCountAll(
      removeFalseValue({
        limit: pageSize * 1,
        offset: pageSize * (current - 1),
        // 过滤条件
        where: {
          varName: varName && { [Op.like]: `%${varName || ''}%` },
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
      return await EnvTagModel.create(data)
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw '标签名重复'
      throw error
    }
  }
  public async addVariable(data: VariableInfo) {
    try {
      return await VariableModel.create(data)
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw '数据重复'
      throw error
    }
  }
  public async updateVariable(data: VariableInfo) {
    try {
      const { id, value, varName, weight, tagId } = data
      await VariableModel.update(removeNullValue({ value, varName, weight, tagId }), {
        where: { id }
      })
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw '数据重复'
      throw error
    }
  }
  public async deleteVariable(id: string) {
    await VariableModel.destroy({ where: { id } })
  }
}
