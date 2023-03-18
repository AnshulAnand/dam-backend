import dotenv from 'dotenv'
dotenv.config()
import config from 'config'
import express from 'express'
import logger from './utils/logger'
import connectDB from './utils/connect'

import deserializeUser from './middleware/deserializeUser'

const app = express()

app.use(express.json())
app.use(deserializeUser)

// importing routes
import healthcheck from './routes/health-check.routes'
import articles from './routes/articles.routes'
import users from './routes/users.routes'
import sessions from './routes/sessions.routes'

// using routes
app.use('/health-check', healthcheck)
app.use('/articles', articles)
app.use('/sessions', sessions)
app.use('/users', users)

const PORT = config.get<number>('port')

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`)
  await connectDB()
})
