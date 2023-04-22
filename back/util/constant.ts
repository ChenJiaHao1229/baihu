import path from 'path'

const BH_Secret = 'BH_Secret'
const BH_ExpiresIn = '480h'
const port = 5600
const rootPath = path.join(__dirname, '../../') as string
const dataPath = path.join(rootPath, 'data')
const templatePath = path.join(rootPath, 'template')
const configPath = path.join(dataPath, 'config')
const logPath = path.join(dataPath, 'log')
const scriptPath = path.join(dataPath, 'script')
const authPath = path.join(configPath, 'auth.json')
const themePath = path.join(configPath, 'theme.json')
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
  configPath,
  logPath,
  scriptPath,
  authError,
  loginFaild,
  whitePath,
  authPath,
  themePath,
  templatePath,
  logs,
  sorter,
  filesFilter,
  runScript,
  userInfo
}
