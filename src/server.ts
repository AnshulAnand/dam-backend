import dotenv from 'dotenv'
dotenv.config()
import config from 'config'
import express, { Request, Response } from 'express'
import routes from './routes'
import logger from './utils/logger'
import connectDB from './utils/connect'
import ArticleModel from './models/article.model'

const app = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json('home')
})

app.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const data = await ArticleModel.findById(id)
  const article = data !== null ? data : ''
  res.json(article)
})

const PORT = config.get<number>('port')

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`)
  await connectDB()
  routes(app)
})
