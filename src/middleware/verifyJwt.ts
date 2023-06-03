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
  console.log({ jwt: cookies.jwt })

  if (!cookies?.jwt) {
    res.status(401)
    res.json({ message: 'You do not have permission to access this route' })
    return
  }

  const JWT: string = cookies.jwt

  jwt.verify(
    JWT,
    config.get<string>('jwtSecret'),
    (err, decoded: jwt.JwtPayload) => {
      if (err) {
        res.status(403)
        res.json({ message: 'You do not have permission to access this route' })
        return
      }
      req.userId = decoded.userId
      next()
    }
  )
}

export default verifyJwt
