export default interface PlanService {
  getPlanList: (pageData: PostSearchListType) => Promise<PaginationType<PlanInfo>>

  updatePlan: (planData: PlanInfo) => void

  deletePlan: (planId: string) => void

  createPlan: (planData: PlanInfo) => void

  runPlan: (id: string) => void

  stopPlan: (id: string) => void
}
