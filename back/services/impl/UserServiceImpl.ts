import { SettingModel } from '../../data/setting'
import { AuthModel } from '../../data/auth'
import { Request } from 'express'
import { tokenManage } from '../../util/tokenManage'
import UserService from '../UserService'
import getNetIp from '../../util/getNetIp'
import { Service } from 'typedi'

@Service()
export default class UserServiceImpl implements UserService {
  // 登录方法
  public async login(
    rUsername: string,
    rPassword: string,
    req: Request
  ): Promise<ResponseDataType<Partial<UserInfo>>> {
    // 当前时间戳
    const timestamp = Date.now()
    const auth = await AuthModel.findOne()
    const { id, wait = 0, lastLogin = 0, username, password } = auth!

    let waitTime = Math.pow(2, wait) * 1000
    // 判断是否还需要等待
    if (wait >= 5 && timestamp - lastLogin < waitTime) {
      waitTime = Math.ceil((waitTime - (timestamp - lastLogin)) / 1000)
      return {
        code: 403,
        status: false,
        message: `暂无权限，请${waitTime}秒后重试`,
        data: { waitTime }
      }
    }
    const { ip, address } = await getNetIp(req)
    //判断密码是否正确
    if (rUsername != username || rPassword != password) {
      await AuthModel.update(
        {
          ...auth,
          wait: wait + 1,
          lastLogin: timestamp,
          ip,
          address
        },
        { where: { id } }
      )
      if (wait + 1 >= 5) {
        const waitTime = Math.round(Math.pow(2, wait + 1))
        return {
          code: 410,
          status: false,
          message: `失败次数过多，请${waitTime}秒后重试`,
          data: { waitTime }
        }
      } else {
        return { code: 400, message: '账号或密码错误！', status: false }
      }
    }
    // 生成token
    const payload = { id, username }
    const token = tokenManage.sign(payload)
    await AuthModel.update(
      {
        ...auth,
        token,
        wait: 0,
        lastLogin: timestamp,
        ip,
        address
      },
      { where: { id } }
    )
    // 登录成功
    return { status: true, code: 200, message: '登录成功！', data: { token } }
  }

  // 获取主题数据
  public async getTheme(): Promise<any> {
    return await SettingModel.findOne({ where: { key: 'theme' } })
  }

  // 修改主题数据
  public async updateTheme(data: any) {
    return (await SettingModel.update({ value: data }, { where: { key: 'theme' } }))[0] !== 0
  }

  // 修改密码
  public async updatePwd(data: updatePwdType, req: Request) {
    const { oldPwd, newPwd } = data
    const { id } = req.user as { id: string }
    return (
      (await AuthModel.update({ password: newPwd }, { where: { id, password: oldPwd } }))[0] !== 0
    )
  }
}
