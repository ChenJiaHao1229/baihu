import { Container } from 'typedi'
import PlanServiceImpl from '../services/impl/PlanServiceImpl'
import { NextFunction, Request, Response, Router } from 'express'

export default (router: Router) => {
  const planService = Container.get(PlanServiceImpl)
  // 创建任务
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await planService.createPlan(req.body)
      res.send({ code: 200, status: true, message: '创建成功 ', data })
    } catch (error) {
      next(error)
    }
  })

  // 获取任务列表
  router.post('/list', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await planService.getPlanList(req.body as PostSearchListType)
      res.send({ code: 200, status: true, message: '查询成功 ', data })
    } catch (error) {
      next(error)
    }
  })

  // 修改任务
  router.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await planService.updatePlan(req.body)
      res.send({ code: 200, status: true, message: '修改成功 ' })
    } catch (error) {
      next(error)
    }
  })

  // 删除任务
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await planService.deletePlan(req.params.id)
      res.send({ code: 200, status: true, message: '删除成功！' })
    } catch (error) {
      next(error)
    }
  })

  return router
}
