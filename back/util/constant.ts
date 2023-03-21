import path from 'path'

const BH_Secret = 'BH_Secret'
const BH_ExpiresIn = '48h'
const rootPath = process.cwd() as string
const dataPath = path.join(rootPath, 'data')
const templatePath = path.join(rootPath, 'template')
const configPath = path.join(dataPath, 'config')
const logPath = path.join(dataPath, 'log')
const scriptPath = path.join(dataPath, 'script')
const authPath = path.join(configPath, 'auth.json')
const themePath = path.join(configPath, 'theme.json')

const authError = '用户名或者密码错误，请重新认证！'
const loginFaild = '请先登录!'
// 校验白名单
const whitePath = ['/login']
export default {
  BH_Secret,
  BH_ExpiresIn,
  port: parseInt((process.env.BACK_PORT as string) ?? 5600, 10),
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
  logs: {
    level: process.env.LOG_LEVEL || 'silly'
  },
  sorter: { ascend: 'ASC', descend: 'DESC' }
}
