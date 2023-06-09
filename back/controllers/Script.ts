import { Container } from 'typedi'
import { NextFunction, Request, Response, Router } from 'express'
import FileSystem from '../services/impl/FileServiceImpl'
import constant from '../util/constant'
import path from 'path'

export default (router: Router) => {
  const fs = Container.get(FileSystem)
  // 获取目录列表 包括子目录
  router.get('/alllist', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fs.readAllDir(constant.scriptPath)
      res.send({ code: 200, status: true, message: '获取成功!', data })
    } catch (error) {
      next(error)
    }
  })
  // 获取目录列表
  router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fs.readDir(path.join(constant.scriptPath, req.query.name as string))
      res.send({ code: 200, status: true, message: '获取成功!', data })
    } catch (error) {
      next(error)
    }
  })

  // 创建文件
  router.post('/file', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fs.make(path.join(constant.scriptPath, req.body.name), req.body.type)
      res.send({ code: 200, status: true, message: '新建成功！', data })
    } catch (error) {
      next(error)
    }
  })

  // 重命名文件
  router.put('/rename', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fs.rename(
        path.join(constant.scriptPath, req.body.oldName),
        path.join(constant.scriptPath, req.body.newName)
      )
      res.send({ code: 200, status: true, message: '修改成功！', data })
    } catch (error) {
      next(error)
    }
  })

  // 删除文件
  router.delete('/file', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fs.rm(path.join(constant.scriptPath, req.body.name), req.body.type)
      res.send({ code: 200, status: true, message: '删除成功！', data })
    } catch (error) {
      next(error)
    }
  })

  // 获取文件内容
  router.get('/file', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fs.readFile(path.join(constant.scriptPath, req.query.name as string))
      res.send({ code: 200, status: true, message: '读取成功！', data })
    } catch (error) {
      next(error)
    }
  })

  // 修改文件内容
  router.put('/file', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, content } = req.body as { name: string; content: string }
      await fs.writeFile(path.join(constant.scriptPath, name), content)
      res.send({ code: 200, status: true, message: '保存成功！', data: { name, content } })
    } catch (error) {
      next(error)
    }
  })
  return router
}
