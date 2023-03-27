if (process.env.NODE_ENV !== 'production') require('dotenv').config()
import config from 'config'
import logger from './utils/logger'
import connectDB from './utils/connect'
import errorHandler from './utils/errorHandler'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import corsOptions from './config/corsOptions'
import express from 'express'
import verifyJwt from './middleware/verifyJwt'

connectDB() // connect to database

const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// importing routes
import healthcheck from './routes/health-check.routes'
import userRoutes from './routes/user.routes'
import articleRoutes from './routes/article.routes'

// using routes
app.use('/health-check', healthcheck)
app.use('/', userRoutes)
app.use(verifyJwt) // use verifyJwt for every route below
app.use('/', articleRoutes)

const PORT = config.get<number>('port')

app.use(errorHandler)

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`))
