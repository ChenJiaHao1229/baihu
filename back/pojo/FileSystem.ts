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
  readFile<T>(filePath?: string): Promise<T> {
    return new Promise((resovle, reject) => {
      if (!fs.existsSync(filePath || this.filePath)) reject('文件或目录不存在！')
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
      resovle(this.data as T)
    })
  }
  // 静态读取文件方法
  public static readFile(filePath: string): Promise<string> {
    return new Promise((resovle, reject) => {
      if (!fs.existsSync(filePath)) reject('文件或目录不存在！')
      const context = fs.readFileSync(filePath, 'utf-8')
      resovle(context)
    })
  }
  // 写入文件数据
  writeFile(data: string | object, filePath?: string): Promise<boolean> {
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
  // 静态写入文件数据
  public static writeFile(filePath: string, data: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.writeFileSync(filePath, data, 'utf-8')
      resolve(true)
    })
  }
  // 读取目录下文件
  public static readDir(filePath: string): Promise<FileInfo[]> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) reject('文件或目录不存在！')
      const files = fs.readdirSync(filePath, { withFileTypes: true }) as FileInfo[]
      // type 0为文件 1为目录 递归查询子目录
      files.forEach(async (item, index) => {
        if (item.isDirectory()) {
          item.type = 1
          item.children = await this.readDir(path.join(filePath, item.name))
        } else {
          item.type = 0
        }
      })
      // 对文件进行一个排序  文件夹放上面 文件放下面
      this.FilesFormat(files)
      resolve(files)
    })
  }
  // 文件数组格式化  文件夹在前文件在后
  private static FilesFormat(data: FileInfo[]) {
    data.forEach((item) => {
      if (item.children && item.children.length > 0) {
        this.FilesFormat(item.children)
      }
    })
    data.sort((a, b) => b.type - a.type)
  }

  // 创建文件
  public static make(filePath: string, type: number = 1) {
    return new Promise<boolean>((resolve, reject) => {
      if (fs.existsSync(filePath)) reject('文件或目录已存在！')
      if (type) fs.mkdirSync(filePath)
      else fs.writeFileSync(filePath, '')
      resolve(true)
    })
  }

  // 文件重命名
  public static rename(oldFilePath: string, newOldFilePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(oldFilePath)) reject('文件或目录不存在！')
      fs.renameSync(oldFilePath, newOldFilePath)
      resolve(true)
    })
  }

  // 删除文件 (遍历删除子文件)
  public static rm(filePath: string, type: number | boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) reject('文件或目录不存在！')
      if (type) {
        // 遍历文件夹下文件 进行子文件删除
        const files = fs.readdirSync(filePath, { withFileTypes: true }) as FileInfo[]
        files.forEach((item) => {
          this.rm(path.join(filePath, item.name), item.isDirectory())
        })
        fs.rmdirSync(filePath)
      } else {
        fs.rmSync(filePath)
      }
      resolve(true)
    })
  }
}
