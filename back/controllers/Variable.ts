import VariableServiceImpl from '../services/impl/VariableServiceImpl'
import { NextFunction, Router, Request, Response } from 'express'
import Container from 'typedi'

export default (router: Router) => {
  const variableService = Container.get(VariableServiceImpl)
  // 获取变量列表
  router.post('/list', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await variableService.getVariable(req.body as PostSearchListType)
      res.send({ code: 200, status: true, message: '查询成功 ', data })
    } catch (error) {
      next(error)
    }
  })
  // 获取环境标签列表
  router.get('/tag', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await variableService.getTagList()
      res.send({ code: 200, status: true, message: '查询成功 ', data })
    } catch (error) {
      next(error)
    }
  })
  // 新增标签
  router.post('/tag', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await variableService.addTag(req.body)
      res.send({ code: 200, status: true, message: '添加成功 ', data })
    } catch (error) {
      next(error)
    }
  })
  // 新增变量
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await variableService.addVariable(req.body)
      res.send({ code: 200, status: true, message: '添加成功 ', data })
    } catch (error) {
      next(error)
    }
  })
  // 修改变量
  router.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await variableService.updateVariable(req.body)
      res.send({ code: 200, status: true, message: '修改成功 ' })
    } catch (error) {
      next(error)
    }
  })
  // 删除变量
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await variableService.deleteVariable(req.params.id)
      res.send({ code: 200, status: true, message: '删除成功 ' })
    } catch (error) {
      next(error)
    }
  })
  return router
}
