import { Request, Response } from 'express'
import ArticleModel from '../models/articles/article.model'
import UserModel from '../models/user.model'
import LikeModel from '../models/articles/article.likes.model'
import asyncHandler from 'express-async-handler'
import { CreateArticleInput, ArticleInput } from '../schema/article.schema'
const nanoid = import('nanoid')

// @desc   Get all articles
// @route  GET /articles
// @access Public
const getAllArticles = asyncHandler(async (req: Request, res: Response) => {
  const results = res.paginatedResults
  if (!results || results.results.length === 0) {
    res.status(400).json({ message: 'No Articles Found' })
    return
  }
  res.json(results)
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

  article.views += 1
  await article.save()

  res.json(article)
})

// @desc   Like article
// @route  POST /articles/like
// @access Private
const likeArticle = asyncHandler(async (req: Request, res: Response) => {
  const { articleId } = req.body

  const liked = await LikeModel.findOne({
    user: req.userId,
    article: articleId
  })

  if (!liked) {
    const article = await ArticleModel.findById(articleId)

    if (!article) {
      res.status(400).json({ message: 'Article Not Found' })
      return
    }

    article.likes += 1
    await article.save()

    const likeObject = { user: req.userId, article: articleId }

    await LikeModel.create(likeObject)

    res.json({ message: 'Like updated successfully' })
  } else {
    const article = await ArticleModel.findById(articleId)

    if (!article) {
      res.status(400).json({ message: 'Article Not Found' })
      return
    }

    article.likes -= 1
    await article.save()

    await liked.deleteOne()

    res.json({ message: 'Like updated successfully' })
  }
})

// @desc   Create new article
// @route  POST /articles
// @access Private
const createArticle = asyncHandler(
  async (req: Request<{}, {}, CreateArticleInput['body']>, res: Response) => {
    const { title, tags, body, image } = req.body

    const userId = req.userId

    const user = await UserModel.findById(userId)

    if (!user) {
      res.status(400)
      res.json({ message: `User with ID: ${userId} not found` })
      return
    }

    if (!title || !body) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const nanoId = (await nanoid).customAlphabet('abcde0123456789', 5)

    const url = title.replace(/ /g, '-') + '-' + nanoId()

    interface ArticleObject {
      user: string
      title: string
      url: string
      tags: Array<string>
      body: string
      image?: string
    }

    const articleObject: ArticleObject = {
      user: user.id,
      title,
      tags,
      url,
      body
    }

    if (image) articleObject.image = image

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
    const { title, tags, body, image, articleId } = req.body

    if (!articleId) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const article = await ArticleModel.findById(articleId)

    if (!article) {
      res.status(400).json({ message: 'Article not found' })
      return
    }

    if (title) {
      article.title = title
      const nanoId = (await nanoid).customAlphabet('abcde0123456789', 5)
      article.url = title.replace(/ /g, '-') + '-' + nanoId()
    }

    if (tags) article.tags = tags
    if (body) article.body = body
    if (image) article.image = image
    if (article.edited === false) article.edited = true

    await article.save()

    res.json({ message: 'Post updated successfully' })
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

  res.json('Post deleted')
})

// @desc   Search article
// @route  POST /articles/search
// @access Public
const searchArticle = asyncHandler(async (req: Request, res: Response) => {
  const { searchText } = req.body

  const articles = await ArticleModel.find({
    $or: [
      { tags: { $regex: searchText, $options: 'i' } },
      { title: { $regex: searchText, $options: 'i' } }
    ]
  })
    .sort({ _id: -1 })
    .exec()

  if (articles.length < 1) {
    res.status(400).json({ message: 'No articles found' })
    return
  }

  res.json(articles)
})

export default {
  getArticle,
  likeArticle,
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  searchArticle
}
