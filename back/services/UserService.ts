import { Request } from 'express'

export default interface UserService {
  login: (
    username: string,
    password: string,
    req: Request
  ) => Promise<ResponseDataType<{ waitTime?: number; token?: string }>>

  getTheme: () => Promise<any>

  updateTheme: (data: any) => Promise<boolean>

  updatePwd: (data: updatePwdType, req: Request & { auth: { id: string } }) => Promise<boolean>
}
