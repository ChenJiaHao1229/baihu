import Logger from '../util/logger'
import { Sequelize } from 'sequelize'

const db = new Sequelize({
  database: 'BH',
  username: 'root',
  password: 'root',
  host: 'localhost', //数据库地址
  port: 3306, //数据库端口
  dialect: 'mysql', //数据库类型
  pool: {
    max: 5, //最大连接数量
    min: 0, //最小连接数
    idle: 30000, //若某个线程30秒没有使用，就释放
    acquire: 30000,
    evict: 10000
  },
  logging: (sql: string, timing?: number) => {
    Logger.debug(`☝️ ${sql}`)
  },
  define: {
    freezeTableName: true
  }
})

export default db
