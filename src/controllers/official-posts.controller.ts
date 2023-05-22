import { Request, Response } from 'express'
import OfficialPostModel from '../models/official-posts.model'
import UserModel from '../models/user.model'
import LikeModel from '../models/articleLikes.model'
import asyncHandler from 'express-async-handler'
import { CreatePostInput, PostInput } from '../schema/official-posts.schema'
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

  const article = await OfficialPostModel.findOne({ url })

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
    const article = await OfficialPostModel.findById(articleId)

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
    const article = await OfficialPostModel.findById(articleId)

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
  async (req: Request<{}, {}, CreatePostInput['body']>, res: Response) => {
    const { title, description, body, image } = req.body
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
      description: string
      body: string
      image?: string
    }

    const articleObject: ArticleObject = {
      user: user.id,
      title,
      url,
      description,
      body
    }

    if (image) articleObject.image = image

    const newArticle = await OfficialPostModel.create(articleObject)

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
  async (req: Request<{}, {}, PostInput['body']>, res: Response) => {
    const { title, description, body, image, postId } = req.body

    if (!postId) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const article = await OfficialPostModel.findById(postId)

    if (!article) {
      res.status(400).json({ message: 'Article not found' })
      return
    }

    if (title) {
      article.title = title
      const nanoId = (await nanoid).customAlphabet('abcde0123456789', 5)
      article.url = title.replace(/ /g, '-') + '-' + nanoId()
    }

    if (body) article.body = body
    if (image) article.image = image
    if (description) article.description = description
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

  const article = await OfficialPostModel.findById(articleId)

  if (!article) {
    res.status(400).json({ message: 'Article not found' })
    return
  }

  await article.deleteOne()

  res.json('Post deleted')
})

export default {
  getArticle,
  likeArticle,
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle
}
