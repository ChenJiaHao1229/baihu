import TaskServiceImpl from '../services/impl/TaskServiceImpl'
import { NextFunction, Request, Response, Router } from 'express'
import FileSystem from '../pojo/FileSystem'
import constant from '../util/constant'
import path from 'path'

export default (router: Router) => {
  // 获取目录列表
  router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await FileSystem.readDir(constant.scriptPath)
      res.send({ code: 200, status: true, message: '修改成功!', data })
    } catch (error) {
      next(error)
    }
  })

  // 创建文件
  router.post('/file', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await FileSystem.make(
        path.join(constant.scriptPath, req.body.name),
        req.body.type
      )
      res.send({ code: 200, status: true, message: '新建成功！', data })
    } catch (error) {
      next(error)
    }
  })

  // 重命名文件
  router.put('/rename', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await FileSystem.rename(
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
      const data = await FileSystem.rm(path.join(constant.scriptPath, req.body.name), req.body.type)
      res.send({ code: 200, status: true, message: '删除成功！', data })
    } catch (error) {
      next(error)
    }
  })

  // 获取文件内容
  router.get('/file', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.query as { name: string }
      const data = await FileSystem.readFile(path.join(constant.scriptPath, name))
      res.send({ code: 200, status: true, message: '读取成功！', data })
    } catch (error) {
      next(error)
    }
  })

  // 修改文件内容
  router.put('/file', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, content } = req.body as { name: string; content: string }
      await FileSystem.writeFile(path.join(constant.scriptPath, name), content)
      res.send({ code: 200, status: true, message: '保存成功！', data: { name, content } })
    } catch (error) {
      next(error)
    }
  })
  return router
}
