import { Request, Response } from 'express'
import ArticleModel from '../models/article.model'
import CommentModel from '../models/comment.model'
import LikeModel from '../models/commentLikes.model'
import { CreateCommentInput, UpdateCommentInput } from '../schema/comment.shema'
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

// @desc   Like comment
// @route  POST /comments/comment
// @access Private
const likeComment = asyncHandler(async (req: Request, res: Response) => {
  const { commentId, parent } = req.body

  if (!commentId || !parent) {
    res.status(400)
    res.json({ message: 'All fields are required' })
    return
  }

  const liked = await LikeModel.findOne({
    user: req.user,
    _id: commentId
  }).exec()

  if (!liked) {
    const comment = await CommentModel.findById(commentId).exec()

    if (!comment) {
      res.status(400).json({ message: 'Comment Not Found' })
      return
    }

    comment.likes += 1
    await comment.save()

    const likeObject = { user: req.user, parent }

    await LikeModel.create(likeObject)

    res.json({ message: 'Like updated successfully' })
  } else {
    const comment = await CommentModel.findById(commentId).exec()

    if (!comment) {
      res.status(400).json({ message: 'Comment Not Found' })
      return
    }

    comment.likes -= 1
    await comment.save()

    await liked.deleteOne()

    res.json({ message: 'Like updated successfully' })
  }
})

// @desc   Post comment
// @route  POST /comments
// @access Private
const postComment = asyncHandler(
  async (req: Request<{}, {}, CreateCommentInput['body']>, res: Response) => {
    const { parent, body } = req.body

    if (!parent || !body) {
      res.status(400)
      res.json({ message: 'All fields are required' })
      return
    }

    const article = await ArticleModel.findOne({ url: parent })

    if (!article) {
      res.status(400)
      res.json({ message: 'Article not found' })
      return
    }

    const commentObject = { user: req.user, parent, body }

    const comment = await CommentModel.create(commentObject)

    article.comments.push(comment._id)

    await article.save()

    if (comment) {
      res.status(201)
      res.json({ message: 'Comment added successfully' })
    } else {
      res.status(400)
      res.json({ message: 'Invalid data received, could not create comment' })
    }
  }
)

// @desc   Update comment
// @route  PATCH /comments
// @access Private
const updateComment = asyncHandler(
  async (req: Request<{}, {}, UpdateCommentInput['body']>, res: Response) => {
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

    if (comment.edited === false) {
      comment.edited = true
    }

    await comment.save()

    res.json({ message: 'Comment updated successfully' })
  }
)

// @desc   Delete comment
// @route  DELETE /comments
// @access Private
const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const { parent }: { parent: string } = req.body

  if (!parent) {
    res.status(400)
    res.json({ message: 'All fields are required' })
    return
  }

  const comment = await CommentModel.findById(parent)

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
  likeComment,
  postComment,
  updateComment,
  deleteComment
}
