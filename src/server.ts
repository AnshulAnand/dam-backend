import dotenv from 'dotenv'
dotenv.config()
import config from 'config'
import express from 'express'
import routes from './routes'
import logger from './utils/logger'
import connectDB from './utils/connect'

import deserializeUser from './middleware/deserializeUser'

const app = express()

app.use(express.json())
app.use(deserializeUser)

const PORT = config.get<number>('port')

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`)
  await connectDB()
  routes(app)
})
