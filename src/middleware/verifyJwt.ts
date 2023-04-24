import { Request, Response, NextFunction } from 'express'
import UserModel from '../models/user.model'
import jwt from 'jsonwebtoken'
import config from 'config'

declare global {
  namespace Express {
    interface Request {
      user: string
    }
  }
}

const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    res.sendStatus(401)
    return
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(
    token,
    config.get<string>('accessTokenSecret'),
    async (err, decoded: jwt.JwtPayload) => {
      if (err) {
        res.sendStatus(403) // invalid token
        return
      }
      const user = await UserModel.findById(decoded.userId)
      req.user = user.username
      next()
    }
  )
}

export default verifyJwt
