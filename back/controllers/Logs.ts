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

  // 删除日志文件
  router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filteredPaths = (req.body as string[]).filter((item, index, array) => {
        return array.filter((subItem, i) => item.indexOf(subItem) === 0 && index !== i).length === 0
      })
      try {
        filteredPaths.forEach((item) =>
          fs.rm(path.join(constant.logPath, item), item.split('/').length === 4)
        )
      } catch (error) {}
      res.send({ code: 200, status: true, message: '删除成功！' })
    } catch (error) {
      next(error)
    }
  })

  // 查询最新的日志
  router.get('/latest', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fs.readLatestFile(path.join(constant.logPath, req.query.path as string))
      res.send({ code: 200, status: true, message: '读取成功！', data })
    } catch (error) {
      res.send({ code: 200, status: true, message: '读取成功！', data: '' })
    }
  })

  return router
}
