import { Request, Response } from 'express'
import ArticleModel from '../models/article.model'
import CommentModel from '../models/comment.model'
import asyncHandler from 'express-async-handler'

// @desc   Get all comments
// @route  GET /comments
// @access Public
const getAllComments = asyncHandler(async (req: Request, res: Response) => {
  const comments = await CommentModel.find().lean()
  if (!comments?.length) {
    res.status(400).json({ message: 'No comments' })
  } else {
    res.json(comments)
  }
})

// @desc   Post comment
// @route  POST /comments
// @access Private
const postComment = asyncHandler(async (req: Request, res: Response) => {
  const { articleId /* url is the articleId */, body } = req.body

  if (!articleId || !body) {
    res.status(400)
    res.json({ message: 'All fields are required' })
    return
  }

  const article = await ArticleModel.findOne({ articleId })

  if (!article) {
    res.json(400)
    res.json({ message: `article ${articleId} not found` })
    return
  }

  const commentObject = { user: article._id, body }

  const comment = await CommentModel.create(commentObject)

  article.comments.push(comment._id)

  await article.save()

  if (comment) {
    res.status(201)
    res.json({ message: `Comment was created successfully` })
  } else {
    res.status(400)
    res.json({ message: `Invalid data received, can not create comment` })
  }
})

// @desc   Update comment
// @route  PATCH /comments
// @access Private
const updateComment = asyncHandler(async (req: Request, res: Response) => {
  const { commentId, body } = req.body

  if (!commentId || !body) {
    res.status(400)
    res.json({ message: 'All fields are reqiured' })
  }

  const comment = await CommentModel.findById(commentId)

  if (!comment) {
    res.status(400)
    res.json({ message: 'Comment not found' })
    return
  }

  comment.body = body

  await comment.save()

  res.json({ message: 'Comment updated successfully' })
})

// @desc   Delete comment
// @route  DELETE /comments
// @access Private
const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const { commentId } = req.body

  if (!commentId) {
    res.status(400)
    res.json({ message: 'All fields are required' })
    return
  }

  const comment = await CommentModel.findById(commentId)

  if (!comment) {
    res.status(400)
    res.json({ message: 'Comment not found' })
    return
  }

  comment.deleteOne()

  res.json({ message: 'Successfully deleted comment' })
})

export default {
  getAllComments,
  postComment,
  updateComment,
  deleteComment
}
