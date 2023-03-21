import request from '@/api/request'

export const userLogin = (params: UserInfo): Promise<ResponseDataType<UserInfo>> => {
  return request({
    url: '/login',
    method: 'GET',
    params
  })
}

export const getTheme = (): Promise<ResponseDataType<{ theme: any }>> => {
  return request({
    url: '/getTheme',
    method: 'GET'
  })
}

export const updateTheme = (data: unknown): Promise<ResponseDataType> => {
  return request({
    url: '/updateTheme',
    method: 'POST',
    data
  })
}
