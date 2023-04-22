import db from '.'
import { DataTypes, Model } from 'sequelize'

interface TaskInstance extends Model<TaskInfo, TaskInfo>, TaskInfo {}

export const TaskModel = db.define<TaskInstance>('task', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    autoIncrement: true
  },
  planId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  taskName: { type: DataTypes.STRING, unique: true },
  path: { type: DataTypes.STRING, primaryKey: true },
  status: { type: DataTypes.INTEGER, defaultValue: 0 },
  runTime: DataTypes.INTEGER
})
