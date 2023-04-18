import request from '../request'

export const getVariableList = (data: PostSearchListType): Promise<VariableResponseType> => {
  return request({ url: '/var/list', method: 'POST', data })
}

export const getTagList = (): Promise<ResponseDataType<EnvTagInfo[]>> => {
  return request({ url: '/var/tag', method: 'GET' })
}

export const addTag = (data: EnvTagInfo): Promise<ResponseDataType<EnvTagInfo>> => {
  return request({ url: '/var/tag', method: 'POST', data })
}

export const addVariable = (data: VariableInfo): Promise<ResponseDataType<VariableInfo>> => {
  return request({ url: '/var', method: 'POST', data })
}

export const updateVariable = (data: VariableInfo): Promise<ResponseDataType<VariableInfo>> => {
  return request({ url: '/var', method: 'PUT', data })
}

export const deleteVariable = (id: string): Promise<ResponseDataType<VariableInfo>> => {
  return request({ url: `/var/${id}`, method: 'DELETE' })
}
