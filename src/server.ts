import dotenv from 'dotenv'
dotenv.config()
import config from 'config'
import logger from './utils/logger'
import connectDB from './utils/connect'
import express from 'express'

connectDB() // connect to database


const app = express()

app.use(express.json())

// importing routes
import healthcheck from './routes/health-check.routes'

// using routes
app.use('/health-check', healthcheck)

const PORT = config.get<number>('port')

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`) )
