import express, { Request, Response, NextFunction, Router } from 'express'
import config from './util/constant'
import Logger from './util/logger'
import User from './controllers/User'
import { tokenManage } from './pojo/TokenManage'
import initFile from './util/initFile'
import bodyParser from 'body-parser'
import initDb from './util/initDb'
import Task from './controllers/Task'
;(async () => {
  // ✌️✊☝️✋
  const app = express()
  const router = Router()

  // 初始化工作
  await initFile()
  await initDb()

  // 开启监听
  app
    .listen(config.port, () => {
      Logger.info(`✌️ 后端服务启动成功！`)
    })
    .on('error', (err) => {
      Logger.error(`✊ ${err}`)
      process.exit(1)
    })

  // 输出日志
  app.use((req, res, next) => {
    Logger.info(`✋ method:${req.method}  url:${req.url}`)
    next()
  })

  // 验证token是否有效 以及过滤无需验证接口
  app.use(tokenManage.guard())
  app.use((err: Error & { status: number }, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
      return res.status(err.status).send({ code: err.status, message: err.message }).end()
    }
    return next(err)
  })

  // 对body处理
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  // 加载其他路由
  app.use('/user', User(router))
  app.use('/task', Task(router))
})()
