import { Request, Response } from 'express'
import CommentModel from '../models/comments/comment.model'
import LikeModel from '../models/comments/comment.likes.model'
import { CreateCommentInput, UpdateCommentInput } from '../schema/comment.shema'
import asyncHandler from 'express-async-handler'
import ArticleModel from '../models/articles/article.model'

// @desc   Get all comments
// @route  GET /comments
// @access Public
const getAllComments = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string)
  const limit = parseInt(req.query.limit as string)
  const articleId = req.query.articleId as string
  const skip = (page - 1) * limit

  const results = await CommentModel.find({ parentArticle: articleId })
    .limit(limit)
    .skip(skip)
    .exec()

  res.json(results)
})

// @desc   GET user comments
// @route  GET /comments/:articleId
// @access Private
const getUserComment = asyncHandler(async (req: Request, res: Response) => {
  const { articleId } = req.params

  const comments = await CommentModel.find({
    user: req.userId,
    parentArticle: articleId
  })

  res.json(comments)
})

// @desc   GET comment by id
// @route  GET /comments/id/:id
// @access Private
const getComment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const comment = await CommentModel.findById(id)

  if (!comment) {
    res.json({ message: 'Comment not found ' })
    return
  }

  res.json(comment)
})

// @desc   Check whether user has liked comment
// @route  GET /comments/check-like/:commentId
// @access Private
const checkLikeComment = asyncHandler(async (req: Request, res: Response) => {
  const { commentId } = req.params

  const liked = await LikeModel.exists({
    _id: commentId,
    user: req.userId
  })

  res.json({ liked })
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

  const liked = await LikeModel.findOne({
    _id: commentId,
    parentArticle: parentArticle
  }).lean()

  if (liked) {
    res.status(400).json({ message: 'You have already liked this comment' })
    return
  }

  const comment = await CommentModel.findById(commentId)

  if (!comment) {
    res.status(400).json({ message: 'Comment Not Found' })
    return
  }

  comment.likes += 1
  await comment.save()

  const likeObject = { user: req.userId, parent: parentArticle }

  await LikeModel.create(likeObject)

  res.json({ message: 'Like upvoted successfully' })
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
      await ArticleModel.findByIdAndUpdate(comment.parentArticle, {
        $inc: { comments: 1 }
      }).exec()
      res.status(201).json({ message: 'Comment added successfully' })
    } else {
      res
        .status(400)
        .json({ message: 'Invalid data received, could not create comment' })
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

    await ArticleModel.findByIdAndUpdate(comment.parentArticle, {
      $inc: { comments: -1 }
    }).exec()

    res.json({ message: 'Comment updated successfully' })
  }
)

// @desc   Delete comment
// @route  DELETE /comments
// @access Private
const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const { commentId }: { commentId: string } = req.body

  if (!commentId) {
    res.status(400)
    res.json({ message: 'Comment ID required' })
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
  getUserComment,
  getAllComments,
  getComment,
  checkLikeComment,
  likeComment,
  postComment,
  updateComment,
  deleteComment
}
