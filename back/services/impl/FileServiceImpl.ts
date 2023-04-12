import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'
import { Service } from 'typedi'
import FileSystem from '../FileService'
import { getFileType } from '../../util'

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
@Service()
export default class FileSystemImpl implements FileSystem {
  data: string | object | unknown
  FileType = FileType

  // 读取文件数据
  public readFile<T = any>(filePath: string, fileType: FileType = FileType.TEXT): Promise<T> {
    return new Promise((resovle, reject) => {
      if (!fs.existsSync(filePath)) reject('文件或目录不存在！')
      const context = fs.readFileSync(filePath, 'utf-8')
      switch (fileType) {
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
  // 写入文件数据
  writeFile(
    filePath: string,
    data: string | object,
    fileType: FileType = FileType.TEXT
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let finalData = ''
      switch (fileType) {
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
      fs.writeFileSync(filePath, finalData, 'utf-8')
      resolve(true)
    })
  }
  // 读取目录下所有文件及子文件
  public readAllDir(filePath: string): Promise<FileInfo[]> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) reject('文件或目录不存在！')
      const files = fs.readdirSync(filePath, { withFileTypes: true }) as FileInfo[]
      // type 0为文件夹 其他为文件 递归查询子目录
      files.forEach(async (item) => {
        if (item.isDirectory()) {
          item.type = 0
          item.children = await this.readAllDir(path.join(filePath, item.name))
        } else item.type = getFileType(item.name)
      })
      // 对文件进行一个排序  文件夹放上面 文件放下面
      this.FilesFormat(files)
      resolve(files)
    })
  }
  // 读取目录下所有文件
  public readDir(filePath: string): Promise<FileInfo[]> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) reject('文件或目录不存在！')
      const files = fs.readdirSync(filePath, { withFileTypes: true }) as FileInfo[]
      files.forEach((item) => {
        if (item.isDirectory()) item.type = 0
        else item.type = getFileType(item.name)
      })
      // 对文件进行一个排序  文件夹放上面 文件放下面
      this.FilesFormat(files)
      resolve(files)
    })
  }
  // 文件数组格式化  文件夹在前文件在后
  private FilesFormat(data: FileInfo[]) {
    data.forEach((item) => {
      if (item.children && item.children.length > 0) {
        this.FilesFormat(item.children)
      }
    })
    data.sort((a, b) => {
      if (a.type === 0) return -1
      else return 1
    })
  }

  // 创建文件
  public make(filePath: string, type: number = 0, data: string = '') {
    return new Promise<boolean>((resolve, reject) => {
      console.log(filePath, type, data)
      if (fs.existsSync(filePath)) reject('文件或目录已存在！')
      if (type) {
        const dirname = path.dirname(filePath)
        // 判断是否有文件夹 没有先创建对应文件夹
        if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true })
        fs.writeFileSync(filePath, data)
      } else fs.mkdirSync(filePath, { recursive: true })
      resolve(true)
    })
  }

  // 文件重命名
  public rename(oldFilePath: string, newOldFilePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(oldFilePath)) reject('文件或目录不存在！')
      fs.renameSync(oldFilePath, newOldFilePath)
      resolve(true)
    })
  }

  // 删除文件 (遍历删除子文件)
  public rm(filePath: string, type: number | boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) reject('文件或目录不存在！')
      if (type) {
        fs.unlinkSync(filePath)
      } else {
        // 遍历文件夹下文件 进行子文件删除
        const files = fs.readdirSync(filePath, { withFileTypes: true }) as FileInfo[]
        files.forEach((item) => {
          this.rm(path.join(filePath, item.name), !item.isDirectory())
        })
        fs.rmdirSync(filePath)
      }
      resolve(true)
    })
  }

  public async appendFile(filePath: string, data: string) {
    fs.appendFileSync(filePath, data)
  }
}
