import path from 'path'

const BH_Secret = process.env.BH_Secret || Math.random().toString(36).substring(2)
const BH_ExpiresIn = '480h'
const port = process.env.PORT || 5600
const rootPath = process.cwd()
const dataPath = path.join(rootPath, 'data')
const logPath = path.join(dataPath, 'log')
const scriptPath = path.join(dataPath, 'script')
const dbPath = path.join(dataPath, 'db')
const varPath = path.join(dbPath, 'var.json')
const tagPath = path.join(dbPath, 'tag.json')
const authError = '用户名或者密码错误，请重新认证！'
const loginFaild = '请先登录!'
const logs = { level: 'silly' }
const sorter = { ascend: 'ASC', descend: 'DESC' }
// 过滤的文件
const filesFilter = ['node_modules', 'package.json']
// 校验白名单
const whitePath = ['/user/login']
const runScript = { js: 'node', ts: 'ts-node' } as { [keyName: string]: string }
const userInfo = { username: 'admin', password: '21232f297a57a5a743894a0e4a801fc3' }

export default {
  BH_Secret,
  BH_ExpiresIn,
  port,
  rootPath,
  dataPath,
  logPath,
  scriptPath,
  dbPath,
  varPath,
  tagPath,
  authError,
  loginFaild,
  whitePath,
  logs,
  sorter,
  filesFilter,
  runScript,
  userInfo
}
