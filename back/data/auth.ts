import db from '.'
import { DataTypes, Model } from 'sequelize'

export type AuthInfo = {
  id?: number
  username?: string
  password?: string
  token?: string
  wait?: number
  lastLogin?: number
  ip?: string
  address?: string
  createdAt?: string
  updatedAt?: string
}

interface AuthInstance extends Model<AuthInfo, AuthInfo>, AuthInfo {}

export const AuthModel = db.define<AuthInstance>('auth', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  token: DataTypes.STRING,
  wait: DataTypes.INTEGER,
  lastLogin: DataTypes.BIGINT,
  ip: DataTypes.STRING,
  address: DataTypes.STRING
})
