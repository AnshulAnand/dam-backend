import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from 'config'

declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies

  if (!cookies?.jwt) {
    res.sendStatus(401)
    return
  }

  const JWT: string = cookies.jwt

  jwt.verify(
    JWT,
    config.get<string>('jwtSecret'),
    (err, decoded: jwt.JwtPayload) => {
      if (err) {
        res.sendStatus(403)
        return
      }
      req.userId = decoded.userId
      next()
    }
  )
}

export default verifyJwt
