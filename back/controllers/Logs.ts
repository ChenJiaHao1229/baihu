import { Container } from 'typedi'
import { NextFunction, Request, Response, Router } from 'express'
import FileSystem from '../services/impl/FileServiceImpl'
import constant from '../util/constant'
import path from 'path'

export default (router: Router) => {
  const fs = Container.get(FileSystem)
  // 获取目录列表 包括子目录
  router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fs.readAllDir(constant.logPath)
      res.send({ code: 200, status: true, message: '获取成功!', data })
    } catch (error) {
      next(error)
    }
  })

  // 获取文件内容
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fs.readFile(path.join(constant.logPath, req.query.path as string))
      res.send({ code: 200, status: true, message: '读取成功！', data })
    } catch (error) {
      next(error)
    }
  })

  return router
}
