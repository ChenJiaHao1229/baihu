import 'reflect-metadata' // typedi 依赖注入需要引入
import bodyParser from 'body-parser'
import express, { Request, Response, NextFunction, Router } from 'express'
import config from './util/constant'
import Logger from './util/logger'
import { tokenManage } from './util/tokenManage'
import initFile from './util/initFile'
import initDb from './util/initDb'
import User from './controllers/User'
import Plan from './controllers/Plan'
import Script from './controllers/Script'
import Task from './controllers/Task'
import Variable from './controllers/Variable'
;(async () => {
  // ✌️✊☝️✋
  const app = express()

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
  app.use('/user', User(Router()))
  app.use('/plan', Plan(Router()))
  app.use('/task', Task(Router()))
  app.use('/script', Script(Router()))
  app.use('/var', Variable(Router()))

  // 统一错误处理
  app.use((err: Error & { status: number }, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500)
    res.json({
      code: err.status || 500,
      status: false,
      message: err.message || err
    })
  })
})()
