export default interface PlanService {
  getPlanList: (pageData: PostSearchListType) => Promise<PaginationType<PlanInfo>>

  updatePlan: (planId: string, planData: PlanInfo) => void

  deletePlan: (planId: string) => void

  createPlan: (planData: PlanInfo) => void
}
