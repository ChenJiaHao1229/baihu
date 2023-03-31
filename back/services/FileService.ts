// 枚举文件类型
enum FileType {
  JSON,
  YAML,
  TEXT,
  JS,
  TS,
  LOG
}
export default interface FileSystem {
  readFile: <T>(filePath: string, fileType: FileType) => Promise<T>
  writeFile: (filePath: string, data: string | object, fileType: FileType) => Promise<boolean>
  readAllDir: (filePath: string) => Promise<FileInfo[]>
  readDir: (filePath: string) => Promise<FileInfo[]>
  make: (filePath: string, type: number) => void
  rename: (oldFilePath: string, newOldFilePath: string) => Promise<boolean>
  rm: (filePath: string, type: number | boolean) => Promise<boolean>
}
