import { Request, Response } from 'express'
import CommentModel from '../models/comments/comment.model'
import LikeModel from '../models/comments/comment.likes.model'
import { CreateCommentInput, UpdateCommentInput } from '../schema/comment.shema'
import asyncHandler from 'express-async-handler'

// @desc   Get all comments
// @route  GET /comments
// @access Public
const getAllComments = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string)
  const limit = parseInt(req.query.limit as string)
  const articleId = req.query.articleId as string
  const skip = (page - 1) * limit

  console.log({ page, limit, articleId })

  const results = await CommentModel.find({ parentArticle: articleId })
    .sort({ _id: -1 })
    .limit(limit)
    .skip(skip)
    .exec()

  res.json(results)
})

// @desc   GET user comments
// @route  GET /comments/:userId
// @access Private
const getUserComment = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId
  const comments = await CommentModel.find({ user: userId })

  if (comments.length < 1) {
    res.json({ message: 'No comments found ' })
    return
  }

  res.json(comments)
})

// @desc   Like comment
// @route  POST /comments/like
// @access Private
const likeComment = asyncHandler(async (req: Request, res: Response) => {
  const { commentId, parentArticle } = req.body

  if (!commentId || !parentArticle) {
    res.status(400)
    res.json({ message: 'All fields are required' })
    return
  }

  const liked = await LikeModel.findById(commentId)

  if (!liked) {
    const comment = await CommentModel.findById(commentId).exec()

    if (!comment) {
      res.status(400).json({ message: 'Comment Not Found' })
      return
    }

    comment.likes += 1
    await comment.save()

    const likeObject = { user: req.userId, parent: parentArticle }

    await LikeModel.create(likeObject)

    res.json({ message: 'Like updated successfully' })
  } else {
    const comment = await CommentModel.findById(commentId)

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
    const { parentArticle, body } = req.body

    if (!parentArticle || !body) {
      res.status(400)
      res.json({ message: 'All fields are required' })
      return
    }

    const commentObject = { user: req.userId, parentArticle, body }

    const comment = await CommentModel.create(commentObject)

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
  const { parentArticle }: { parentArticle: string } = req.body

  if (!parentArticle) {
    res.status(400)
    res.json({ message: 'Comment ID required' })
    return
  }

  const comment = await CommentModel.findOne({
    parentArticle,
    user: req.userId
  })

  if (!comment) {
    res.status(400)
    res.json({ message: 'Comment not found' })
    return
  }

  comment.deleteOne()

  res.json({ message: 'Successfully deleted comment' })
})

export default {
  getUserComment,
  getAllComments,
  likeComment,
  postComment,
  updateComment,
  deleteComment
}
