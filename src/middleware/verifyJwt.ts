import { Request, Response, NextFunction } from 'express'
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
  console.log(authHeader)

  if (!authHeader) {
    res.sendStatus(401)
    return
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(
    token,
    config.get<string>('accessTokenSecret'),
    (err, decoded: jwt.JwtPayload) => {
      if (err) {
        res.sendStatus(403) // invalid token
        return
      }
      req.user = decoded.username
      next()
    }
  )
}

export default verifyJwt
