import { DataTypes, Model } from 'sequelize'
import db from '.'

interface TaskInstance extends Model<TaskInfo, TaskInfo>, TaskInfo {}

export const TaskModel = db.define<TaskInstance>('task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: true,
    autoIncrement: true
  },
  taskName: { type: DataTypes.STRING, allowNull: true },
  cron: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastRunTime: DataTypes.BIGINT,
  runTime: DataTypes.BIGINT
})
