import TaskServiceImpl from '../services/impl/TaskServiceImpl'
import { NextFunction, Request, Response, Router } from 'express'

export default (router: Router) => {
  const taskServiceImpl = new TaskServiceImpl()
  // 创建任务
  router.post('/task', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await taskServiceImpl.createTask(req.body)
      res.send({ code: 200, status: true, message: '创建成功 ', data })
    } catch (error) {
      next(error)
    }
  })

  // 获取任务列表
  router.post('/tasklist', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await taskServiceImpl.getTaskList(req.body as PostSearchListType)
      res.send({ code: 200, status: true, message: '创建成功 ', data })
    } catch (error) {
      next(error)
    }
  })

  router.put('/task/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await taskServiceImpl.updateTask(req.params.id, req.body)
      res.send({ code: 200, status: true, message: '修改成功 ' })
    } catch (error) {
      next(error)
    }
  })

  return router
}
