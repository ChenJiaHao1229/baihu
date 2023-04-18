import db from '.'
import { DataTypes, Model } from 'sequelize'

interface VariableInstance extends Model<VariableInfo, VariableInfo>, VariableInfo {}

export const VariableModel = db.define<VariableInstance>('variable', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    autoIncrement: true
  },
  varName: {
    type: DataTypes.STRING,
    unique: true
  },
  tagId: { type: DataTypes.INTEGER, allowNull: true, primaryKey: true },
  value: { type: DataTypes.STRING, allowNull: true, primaryKey: true },
  weight: { type: DataTypes.INTEGER, defaultValue: 1 }
})

interface EnvTagInstance extends Model<EnvTagInfo, EnvTagInfo>, EnvTagInfo {}

export const EnvTagModel = db.define<EnvTagInstance>('envTag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { type: DataTypes.STRING, allowNull: true, unique: true }
})
