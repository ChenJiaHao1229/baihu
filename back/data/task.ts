import db from '.'
import { DataTypes, Model } from 'sequelize'
import { PlanModel } from './plan'

interface TaskInstance extends Model<TaskInfo, TaskInfo>, TaskInfo {}

export const TaskModel = db.define<TaskInstance>('task', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: true,
    autoIncrement: true
  },
  planId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: true
  },
  taskName: { type: DataTypes.STRING, allowNull: true, unique: true },
  path: { type: DataTypes.STRING, allowNull: true, primaryKey: true },
  status: { type: DataTypes.INTEGER, defaultValue: 0 },
  runTime: DataTypes.NUMBER
})
