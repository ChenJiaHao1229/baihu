import db from '.'
import { DataTypes, Model } from 'sequelize'

export type SettingInfo = {
  key: string
  value?: any
}

interface SettingInstance extends Model<SettingInfo, SettingInfo>, SettingInfo {}

export const SettingModel = db.define<SettingInstance>('setting', {
  key: { type: DataTypes.STRING, primaryKey: true, allowNull: true },
  value: DataTypes.JSON
})
