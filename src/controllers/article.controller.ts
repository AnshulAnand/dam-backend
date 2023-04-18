import dayjs from 'dayjs'
import { Request, Response } from 'express'
import ArticleModel from '../models/article.model'
import UserModel from '../models/user.model'
import asyncHandler from 'express-async-handler'
import { CreateArticleInput, ArticleInput } from '../schema/article.schema'

// @desc   Get all articles
// @route  GET /articles
// @access Public
const getAllArticles = asyncHandler(async (req: Request, res: Response) => {
  const articles = await ArticleModel.find().lean()
  if (!articles?.length) {
    res.status(400).json({ message: 'No Articles Found' })
  } else {
    res.json(articles)
  }
})

// @desc   Get article
// @route  GET /articles/:articleId
// @access Public
const getArticle = asyncHandler(async (req: Request, res: Response) => {
  const url = req.params.articleId

  const article = await ArticleModel.findOne({ url }).lean()

  if (!article) {
    res.status(400).json({ message: 'No Article Found' })
  } else {
    res.json(article)
  }
})

// @desc   Create new article
// @route  POST /articles
// @access Private
const createArticle = asyncHandler(
  async (req: Request<{}, {}, CreateArticleInput['body']>, res: Response) => {
    const { title, body } = req.body
    const username = req.user

    const user = await UserModel.findOne({ username })

    if (!user) {
      res.status(400)
      res.json({ message: `User ${username} not found` })
      return
    }

    if (!title || !body) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const url =
      title.replace(/ /g, '-') + '-' + dayjs(new Date()).format('DD/MM/YY')

    const articleObject = { user: user.id, title, url, body }

    const newArticle = await ArticleModel.create(articleObject)

    if (newArticle) {
      res.status(201).json({ message: `Post created successfully` })
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

    await article.save()

    res.json({ message: 'Post updated successfully' })
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

  const article = await ArticleModel.findOne({ url }).exec()

  if (!article) {
    res.status(400).json({ message: 'Article not found' })
    return
  }

  article.deleteOne()

  res.json('Post deleted')
})

export default {
  getArticle,
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle
}
