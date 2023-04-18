import logger from './logger'
import logEvents from './logEvents'
import { ErrorRequestHandler } from 'express'

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`)
  logger.error(err.stack)
  logEvents(`${err.name}: ${err.message}`, 'log.txt')
  logEvents(`${err.stack}`, 'log.txt')
  const status = res.statusCode ? res.statusCode : 500 // server error
  res.status(status)
  res.json({ message: err.message })
  next()
}

export default errorHandler
