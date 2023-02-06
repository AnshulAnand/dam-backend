import express, { Request, Response } from 'express'
import logger from './utils/logger'
import connectDB from './utils/connect'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.get('/', (req, res) => {
  res.send('hi')
})

const PORT = process.env.PORT || 1337

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`)

  await connectDB()
})
