import request from '@/api/request'

// 登录接口
export const userLogin = (params: Partial<UserInfo>): Promise<ResponseDataType<UserInfo>> => {
  return request({ url: '/user/login', method: 'GET', params })
}

// 获取主题接口
export const getTheme = (): Promise<ResponseDataType<{ theme: any }>> => {
  return request({ url: '/user/theme', method: 'GET' })
}

// 修改主题接口
export const updateTheme = (data: unknown): Promise<ResponseDataType> => {
  return request({ url: '/user/theme', method: 'PUT', data })
}

// 修改密码
export const updatePwd = (data: updatePwdType): Promise<ResponseDataType> => {
  return request({ url: '/user/password', method: 'PUT', data })
}
