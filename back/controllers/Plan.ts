import { Container } from 'typedi'
import PlanServiceImpl from '../services/impl/PlanServiceImpl'
import { NextFunction, Request, Response, Router } from 'express'

export default (router: Router) => {
  const planService = Container.get(PlanServiceImpl)
  // 创建计划
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await planService.createPlan(req.body)
      res.send({ code: 200, status: true, message: '创建成功 ', data })
    } catch (error) {
      next(error)
    }
  })

  // 获取计划列表
  router.post('/list', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await planService.getPlanList(req.body as PostSearchListType)
      res.send({ code: 200, status: true, message: '查询成功 ', data })
    } catch (error) {
      next(error)
    }
  })

  // 修改计划
  router.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await planService.updatePlan(req.body)
      res.send({ code: 200, status: true, message: '修改成功 ' })
    } catch (error) {
      next(error)
    }
  })

  // 删除计划
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await planService.deletePlan(req.params.id)
      res.send({ code: 200, status: true, message: '删除成功！' })
    } catch (error) {
      next(error)
    }
  })

  // 运行计划
  router.put('/run/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await planService.runPlan(req.params.id)
      res.send({ code: 200, status: true, message: '运行成功' })
    } catch (error) {
      next(error)
    }
  })
  // 暂停计划
  router.put('/stop/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await planService.stopPlan(req.params.id)
      res.send({ code: 200, status: true, message: '暂停成功' })
    } catch (error) {
      next(error)
    }
  })

  return router
}
