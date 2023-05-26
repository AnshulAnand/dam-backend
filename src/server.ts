if (process.env.NODE_ENV !== 'production') require('dotenv').config()
import config from 'config'
import connectDB from './utils/connect'
import errorHandler from './utils/errorHandler'
import logger from './utils/logger'
import logEvents from './utils/logEvents'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import corsOptions from './config/corsOptions'
import express from 'express'

connectDB() // connect to database

const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// importing routes
import healthcheck from './routes/health-check.routes'
import userRoutes from './routes/user.routes'
import articleRoutes from './routes/article.routes'
import commentRoutes from './routes/comment.routes'
import replyRoutes from './routes/reply.routes'

// using routes
app.use('/health-check', healthcheck)
app.use('/users', userRoutes)
app.use('/articles', articleRoutes)
app.use('/comments', commentRoutes)
app.use('/replies', replyRoutes)

const PORT = config.get<number>('port')

app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`)
  logEvents(`Server started on port ${PORT}`, 'logs.txt')
})
