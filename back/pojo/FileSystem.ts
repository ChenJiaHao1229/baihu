import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

// 枚举文件类型
enum FileType {
  JSON,
  YAML,
  TEXT,
  JS,
  TS,
  LOG
}

// 文件操作对象
export default class FileSystem {
  filePath: string
  fileType: FileType
  data: string | object | unknown
  static FileType = FileType

  constructor(
    file: string | { path: string; fileNmae: string },
    fileType: FileType = FileType.JSON
  ) {
    // 判断文件传入类型
    if (typeof file === 'string') {
      this.filePath = file
    } else {
      this.filePath = path.join(file.path, file.fileNmae)
    }
    this.fileType = fileType
  }

  // 读取文件数据
  readFile(filePath?: string) {
    return new Promise((resovle, reject) => {
      const context = fs.readFileSync(filePath || this.filePath, 'utf-8')
      switch (this.fileType) {
        case FileType.JSON:
          this.data = JSON.parse(context)
          break
        case FileType.YAML:
          this.data = yaml.load(context)
          break
        case FileType.TEXT:
          this.data = context
      }
      resovle(this.data)
    })
  }

  // 写入文件数据
  writeFile(data: string | object, filePath?: string) {
    return new Promise((resolve, reject) => {
      let finalData = ''
      switch (this.fileType) {
        case FileType.JSON:
          finalData = JSON.stringify(data)
          break
        case FileType.YAML:
          finalData = yaml.dump(data)
          break
        case FileType.TEXT:
          finalData = data as string
          break
      }
      fs.writeFileSync(filePath || this.filePath, finalData, 'utf-8')
      resolve(true)
    })
  }
}
