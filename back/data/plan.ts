import { DataTypes, Model } from 'sequelize'
import db from '.'

interface PlanInstance extends Model<PlanInfo, PlanInfo>, PlanInfo {}

export const PlanModel = db.define<PlanInstance>('plan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: true,
    autoIncrement: true
  },
  planName: { type: DataTypes.STRING, unique: true, allowNull: true },
  cron: { type: DataTypes.STRING, allowNull: true },
  disable: { type: DataTypes.BOOLEAN, defaultValue: false },
  lastRunTime: DataTypes.BIGINT
})
