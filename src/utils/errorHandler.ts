import logger from './logger'
import { ErrorRequestHandler } from 'express'

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`)
  logger.error(err.stack)
  const status = res.statusCode ? res.statusCode : 500 // server error
  res.status(status)
  res.json({ message: err.message })
  next()
}

export default errorHandler
