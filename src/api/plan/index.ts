import request from '@/api/request'

export const createPlan = (data: PlanInfo): Promise<PlanListResponseType> => {
  return request({ url: '/plan', method: 'POST', data })
}
export const getPlanList = (data: PostSearchListType): Promise<PlanListResponseType> => {
  return request({ url: '/plan/list', method: 'POST', data })
}

export const updatePlan = (data: PlanInfo): Promise<PlanListResponseType> => {
  return request({ url: `/plan`, method: 'PUT', data })
}

export const deletePlan = (id: string): Promise<PlanListResponseType> => {
  return request({ url: `/plan/${id}`, method: 'DELETE' })
}
