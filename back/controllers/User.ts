import { AuthModel } from './../data/auth'
import { Router, Request, Response, NextFunction } from 'express'
import UserServiceImpl from '../services/impl/UserServiceImpl'

export default (router: Router) => {
  const userServiceImpl = new UserServiceImpl()
  // 登录接口
  router.get('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.query as { username: string; password: string }
      const data = await userServiceImpl.login(username, password, req)
      res.send(data)
    } catch (error) {
      return next(error)
    }
  })

  // 获取主题数据
  router.get('/theme', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const theme = await userServiceImpl.getTheme()
      res.send({ code: 200, status: true, data: { theme: theme?.value } })
    } catch (error) {
      return next(error)
    }
  })

  // 修改主题数据
  router.put('/theme', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await userServiceImpl.updateTheme(req.body)
      if (result) res.send({ code: 200, status: true, message: '修改成功！' })
      else res.send({ code: 200, status: false, message: '修改失败！' })
    } catch (error) {
      next(error)
    }
  })

  // 修改密码
  router.put('/password', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await userServiceImpl.updatePwd(req.body, req)
      if (result) res.send({ code: 200, status: true, message: '修改成功！' })
      else res.send({ code: 200, status: false, message: '密码错误！' })
    } catch (error) {
      next(error)
    }
  })

  return router
}
