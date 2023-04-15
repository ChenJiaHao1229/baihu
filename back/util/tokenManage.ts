import jwt, { SignOptions } from 'jsonwebtoken'
import expressjwt, { IsRevokedCallback } from 'express-jwt'
import constant from './constant'

type payloadType = string | Buffer | object

export default class TokenManage {
  // 私有key
  secretOrPrivateKey: string
  // 过期时间
  expiresIn: string
  constructor(secretOrPrivateKey: string, expiresIn: string) {
    this.secretOrPrivateKey = secretOrPrivateKey
    this.expiresIn = expiresIn
  }
  // 签发token
  sign(payload: payloadType, options?: SignOptions) {
    return jwt.sign(payload, this.secretOrPrivateKey, {
      expiresIn: this.expiresIn,
      algorithm: 'HS512',
      ...options
    })
  }
  // 校验tokenF
  verify(payload: string, options?: SignOptions) {
    return jwt.verify(payload, this.secretOrPrivateKey, options)
  }
  // token验证
  guard(isRevoked?: IsRevokedCallback | undefined) {
    return expressjwt({
      secret: this.secretOrPrivateKey,
      algorithms: ['HS512'],
      isRevoked
    }).unless({ path: constant.whitePath })
  }
}

export const tokenManage = new TokenManage(constant.BH_Secret, constant.BH_ExpiresIn)
