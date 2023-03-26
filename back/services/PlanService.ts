export default interface PlanService {
  getPlanList: (pageData: PostSearchListType) => Promise<PaginationType<PlanInfo>>

  updatePlan: (planId: string, planData: PlanInfo) => Promise<ResponseDataType>

  deletePlan: (planId: string) => void

  createPlan: (planData: PlanInfo) => void
}
