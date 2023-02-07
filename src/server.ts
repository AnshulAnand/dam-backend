import path from 'path'
import express, { Request, Response } from 'express'
import logger from './utils/logger'
import connectDB from './utils/connect'
import dotenv from 'dotenv'
dotenv.config()

import ArticleModel from './models/article.model'

const app = express()

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/', (req: Request, res: Response) => {
  res.render('home')
})

app.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const data = await ArticleModel.findById(id)
  const article = data !== null ? data : ''
  res.render('articles/index', { article })
})

const PORT = process.env.PORT || 1337

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`)
  await connectDB()
})
