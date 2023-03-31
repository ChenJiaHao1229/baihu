import db from '.'
import { DataTypes, Model } from 'sequelize'

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
  taskName: { type: DataTypes.STRING, allowNull: true },
  path: { type: DataTypes.STRING, allowNull: true, primaryKey: true },
  status: { type: DataTypes.INTEGER, defaultValue: 0 },
  disable: { type: DataTypes.BOOLEAN, defaultValue: false },
  runTime: DataTypes.DATE
})
