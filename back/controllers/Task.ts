import { NextFunction, Request, Response, Router } from 'express'
import Container from 'typedi'
import TaskServiceImpl from '../services/impl/TaskServiceImpl'

export default (router: Router) => {
  const taskService = Container.get(TaskServiceImpl)

  // 获取任务列表
  router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await taskService.getTaskList(req.query as TaskInfo)
      res.send({ code: 200, status: true, message: '查询成功', data })
    } catch (error) {
      next(error)
    }
  })

  // 运行任务
  router.put('/run', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await taskService.runTask(req.body.id)
      res.send({})
    } catch (error) {
      next(error)
    }
  })

  // 添加任务
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await taskService.addTask(req.body)
      res.send({ code: 200, status: true, message: '添加成功', data })
    } catch (error) {
      next(error)
    }
  })

  // 删除任务
  router.delete('/:taskId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await taskService.deleteTask(req.params.taskId)
      res.send({ code: 200, status: true, message: '删除成功' })
    } catch (error) {
      next(error)
    }
  })
  // 修改任务
  router.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await taskService.updateTask(req.body)
      res.send({ code: 200, status: true, message: '修改成功' })
    } catch (error) {
      next(error)
    }
  })

  return router
}
