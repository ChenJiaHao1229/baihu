import { NextFunction, Request, Response, Router } from 'express'
import Container from 'typedi'
import TaskServiceImpl from '../services/impl/TaskServiceImpl'

export default (router: Router) => {
  const taskService = Container.get(TaskServiceImpl)

  // 获取任务列表
  router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(0, req.query)
      const data = await taskService.getTaskList(req.query as TaskInfo)
      res.send({ code: 200, status: true, message: '查询成功 ', data })
    } catch (error) {
      next(error)
    }
  })

  return router
}
