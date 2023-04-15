import request from '@/api/request'

export const createPlan = (data: PlanInfo): Promise<ResponseDataType> => {
  return request({ url: '/plan', method: 'POST', data })
}
export const getPlanList = (data: PostSearchListType): Promise<PlanListResponseType> => {
  return request({ url: '/plan/list', method: 'POST', data })
}

export const updatePlan = (data: PlanInfo): Promise<ResponseDataType> => {
  return request({ url: `/plan`, method: 'PUT', data })
}

export const deletePlan = (id: string): Promise<ResponseDataType> => {
  return request({ url: `/plan/${id}`, method: 'DELETE' })
}

export const runPlan = (id: string): Promise<ResponseDataType> => {
  return request({ url: `/plan/run/${id}`, method: 'PUT' })
}

export const stopPlan = (id: string): Promise<ResponseDataType> => {
  return request({ url: `/plan/stop/${id}`, method: 'PUT' })
}
