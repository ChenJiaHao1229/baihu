import * as path from 'path'
import * as fs from 'fs'

interface VarType {
  name?: string
  tagId?: string
  value?: string
  weight?: number
}

interface TagType {
  id: string
  name: string
}

class Variable {
  private static path: string = './data/db'
  private static tagPath: string = path.resolve(process.cwd(), this.path, 'tag.json')
  private static varPath: string = path.resolve(process.cwd(), this.path, 'var.json')

  // 查询变量
  private static getVars(): VarType[] {
    try {
      // 读取 var.json 文件内容
      const configFileContent = fs.readFileSync(this.varPath, 'utf-8')
      return JSON.parse(configFileContent) || []
    } catch (error) {
      console.error('读取变量数据失败:', error)
      return []
    }
  }
  // 查询标签
  private static getTags(): TagType[] {
    try {
      // 读取 var.json 文件内容
      const configFileContent = fs.readFileSync(this.tagPath, 'utf-8')
      return JSON.parse(configFileContent) || []
    } catch (error) {
      console.error('读取变量数据失败:', error)
      return []
    }
  }
  // 根据变量名查询
  static getByName(name: string): VarType | undefined {
    const vars = this.getVars()
    return vars.find((item) => item.name === name)
  }
  // 根据标签名查询
  static getByTagName(tagName: string): VarType[] {
    const vars = this.getVars()
    const tags = this.getTags()
    const tag = tags.find((item) => item.name === tagName)
    if (!tag) return []
    return vars
      .filter((item) => item.tagId === tag.id)
      .sort((a, b) => (b.weight || 0) - (a.weight || 0))
  }
  // 查询所有数据
  static getList(): VarType[] {
    return this.getVars().sort((a, b) => (b.weight || 0) - (a.weight || 0))
  }
}
export default Variable
