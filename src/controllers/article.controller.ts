import dayjs from 'dayjs'
import { Request, Response } from 'express'
import ArticleModel from '../models/article.model'
import asyncHandler from 'express-async-handler'
import { CreateArticleInput, ArticleInput } from '../schema/article.schema'

// @desc   Get all articles
// @route  GET /articles
// @access Private
const getAllArticles = asyncHandler(async (req: Request, res: Response) => {
  const articles = await ArticleModel.find().lean()
  if (!articles?.length) {
    res.status(400).json({ message: 'No Articles Found' })
  } else {
    res.json(articles)
  }
})

// @desc   Create new article
// @route  POST /articles
// @access Private
const createArticle = asyncHandler(
  async (req: Request<{}, {}, CreateArticleInput['body']>, res: Response) => {
    const { user, title, body, images } = req.body

    if (!title || !body) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const url =
      title.replace(/ /g, '-') + '-' + dayjs(new Date()).format('DD/MM/YY')

    const articleObject = { user, title, url, body }

    const newArticle = await ArticleModel.create(articleObject)

    if (newArticle) {
      res
        .status(201)
        .json({ message: `New article "${title}" was created successfully` })
    } else {
      res
        .status(400)
        .json({ message: 'Invalid data received, could not create article' })
    }
  }
)

// @desc   Update article
// @route  PATCH /articles
// @access Private
const updateArticle = asyncHandler(
  async (req: Request<{}, {}, ArticleInput['body']>, res: Response) => {
    const { url, title, body } = req.body

    if (!url || !title || !body) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const article = await ArticleModel.findOne({ url: url }).exec()
    console.log(article)

    if (!article) {
      res.status(400).json({ message: 'Article not found' })
      return
    }

    article.url =
      title.replace(/ /g, '-') + '-' + dayjs(new Date()).format('DD/MM/YY')
    article.title = title
    article.body = body

    const updatedArticle = await article.save()

    res.json({ message: `"${title}" updated` })
  }
)

// @desc   Delete article
// @route  DELETE /articles
// @access Private
const deleteArticle = asyncHandler(async (req: Request, res: Response) => {
  const { url } = req.body

  if (!url) {
    res.status(400).json({ message: 'URL required' })
    return
  }

  const article = await ArticleModel.findOne({ url: url }).exec()

  if (!article) {
    res.status(400).json({ message: 'Article not found' })
    return
  }

  const result = article.deleteOne()

  res.json(`"${url}" deleted`)
})

export default {
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle
}
