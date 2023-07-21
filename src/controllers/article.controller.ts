import {
  CreateArticleInput,
  UpdateArticleInput,
  SearchArticleInput
} from '../schema/article.schema'
import { Request, Response } from 'express'
import ArticleModel from '../models/articles/article.model'
import UserModel from '../models/user.model'
import LikeModel from '../models/articles/article.likes.model'
import asyncHandler from 'express-async-handler'
const nanoid = import('nanoid')

// @desc   Get all articles
// @route  GET /articles
// @access Public
const getAllArticles = asyncHandler(async (req: Request, res: Response) => {
  const results = res.paginatedResults
  res.json(results)
})

// @desc   GET user articles
// @route  GET /articles/user/:userId
// @access Private
const getUserArticles = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params

  const page = parseInt(req.query.page as string)
  const limit = parseInt(req.query.limit as string)
  const skip = (page - 1) * limit

  const articles = await ArticleModel.find({ user: userId })
    .sort({ _id: -1 })
    .limit(limit)
    .skip(skip)
    .exec()

  res.json(articles)
})

// @desc   Get article
// @route  GET /articles/:url
// @access Public
const getArticle = asyncHandler(async (req: Request, res: Response) => {
  const { url } = req.params

  const article = await ArticleModel.findOne({ url })

  if (!article) {
    res.status(400).json({ message: 'No Article Found' })
    return
  }

  await UserModel.findByIdAndUpdate(article.user, {
    $inc: { views: 1 }
  }).exec()

  article.views += 1
  await article.save()

  res.json(article)
})

// @desc   Get article by Id
// @route  GET /articles/id/:id
// @access Public
const getArticleById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const article = await ArticleModel.findById(id)

  if (!article) {
    res.status(400).json({ message: 'No Article Found' })
    return
  }

  res.json(article)
})

// @desc   Check whether user has liked article
// @route  GET /articles/check-like/:articleId
// @access Private
const checkLikeArticle = asyncHandler(async (req: Request, res: Response) => {
  const { articleId } = req.params

  const liked = await LikeModel.exists({
    user: req.userId,
    article: articleId
  })

  res.json({ liked })
})

// @desc   Like article
// @route  POST /articles/like
// @access Private
const likeArticle = asyncHandler(async (req: Request, res: Response) => {
  const { articleId } = req.body

  const liked = await LikeModel.findOne({
    user: req.userId,
    article: articleId
  }).lean()

  if (liked) {
    res.status(400).json({ message: 'You have already liked this article' })
    return
  }

  const article = await ArticleModel.findById(articleId)

  if (!article) {
    res.status(400).json({ message: 'Article Not Found' })
    return
  }

  article.likes += 1
  await article.save()

  const likeObject = { user: req.userId, article: articleId }

  await LikeModel.create(likeObject)

  res.json({ message: 'Like upvoted successfully' })
})

// @desc   Create new article
// @route  POST /articles
// @access Private
const createArticle = asyncHandler(
  async (req: Request<{}, {}, CreateArticleInput['body']>, res: Response) => {
    const { title, tags, description, body, image } = req.body

    const userId = req.userId

    const user = await UserModel.findById(userId)

    if (!user) {
      res.status(400)
      res.json({ message: `User with ID: ${userId} not found` })
      return
    }

    user.articles += 1
    await user.save()

    if (!title || !body) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const nanoId = (await nanoid).customAlphabet('abcde0123456789', 5)

    const url =
      title
        .trim()
        .replace(/[^a-z\d\s]+/gi, '')
        .replace(/ /g, '-') +
      '-' +
      nanoId()

    const articleObject = {
      user: user.id,
      title,
      tags,
      url,
      description,
      body,
      image
    }

    const newArticle = await ArticleModel.create(articleObject)

    if (newArticle) {
      res.status(201).json(newArticle)
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
  async (req: Request<{}, {}, UpdateArticleInput['body']>, res: Response) => {
    const { title, tags, description, body, image, articleId } = req.body

    if (!articleId) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const article = await ArticleModel.findById(articleId)

    if (!article) {
      res.status(400).json({ message: 'Article not found' })
      return
    }

    if (title) article.title = title
    if (tags) article.tags = tags
    if (description) article.description = description
    if (body) article.body = body
    if (image) article.image = image
    if (article.edited === false) article.edited = true

    const updatedArticle = await article.save()

    res.json(updatedArticle)
  }
)

// @desc   Delete article
// @route  DELETE /articles
// @access Private
const deleteArticle = asyncHandler(async (req: Request, res: Response) => {
  const { articleId } = req.body

  if (!articleId) {
    res.status(400).json({ message: 'Article ID required' })
    return
  }

  const article = await ArticleModel.findById(articleId)

  if (!article) {
    res.status(400).json({ message: 'Article not found' })
    return
  }

  await article.deleteOne()

  await UserModel.findByIdAndUpdate(article.user, {
    $inc: { articles: -1 }
  }).exec()

  res.json({ message: 'Post deleted' })
})

// @desc   Search article
// @route  GET /articles/search
// @access Public
const searchArticle = asyncHandler(
  async (req: Request<{}, {}, SearchArticleInput['query']>, res: Response) => {
    const page = parseInt(req.query.page as string)
    const limit = parseInt(req.query.limit as string)
    const category = req.query.category
    const body = req.query.body as string
    const skip = (page - 1) * limit

    if (category === 'text') {
      const articles = await ArticleModel.find({
        $or: [
          { tags: { $regex: body, $options: 'i' } },
          { title: { $regex: body, $options: 'i' } }
        ]
      })
        .sort({ _id: -1 })
        .limit(limit)
        .skip(skip)
        .exec()

      res.json(articles)
    } else {
      const results = await ArticleModel.find({
        tags: { $regex: body, $options: 'i' }
      })
        .sort({ _id: -1 })
        .limit(limit)
        .skip(skip)
        .exec()

      res.json(results)
    }
  }
)

export default {
  getArticle,
  getUserArticles,
  getArticleById,
  checkLikeArticle,
  likeArticle,
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  searchArticle
}
