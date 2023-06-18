import { Request, Response } from 'express'
import ReplyModel from '../models/replies/reply.model'
import LikeModel from '../models/replies/reply.likes.model'
import { CreateReplyInput, UpdateReplyInput } from '../schema/reply.schema'
import asyncHandler from 'express-async-handler'
import CommentModel from '../models/comments/comment.model'

// @desc   Get all replies
// @route  GET /replies
// @access Public
const getAllreplies = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string)
  const limit = parseInt(req.query.limit as string)
  const articleId = req.query.articleId as string
  const commentId = req.query.commentId as string
  const skip = (page - 1) * limit

  const results = await ReplyModel.find({
    parentArticle: articleId,
    parentComment: commentId
  })
    .limit(limit)
    .skip(skip)
    .exec()

  res.json(results)
})

// @desc   Check whether user has liked reply
// @route  GET /replies/check-like/:replyId
// @access Private
const checkLikeReply = asyncHandler(async (req: Request, res: Response) => {
  const { replyId } = req.params

  const liked = await LikeModel.exists({
    _id: replyId,
    user: req.userId
  })

  res.json({ liked })
})

// @desc   Like reply
// @route  POST /replies/like
// @access Private
const likeReply = asyncHandler(async (req: Request, res: Response) => {
  const { replyId, parentComment } = req.body

  if (!replyId || !parentComment) {
    res.status(400)
    res.json({ message: 'All fields are required' })
    return
  }

  const liked = await LikeModel.findOne({ _id: replyId, parentComment })

  if (liked) {
    res.json({ message: 'You have already liked this reply' })
    return
  }

  const reply = await ReplyModel.findById(replyId)

  if (!reply) {
    res.status(400).json({ message: 'Reply Not Found' })
    return
  }

  reply.likes += 1
  await reply.save()

  const likeObject = { user: req.userId, parentComment }

  await LikeModel.create(likeObject)

  res.json({ message: 'Like upvoted successfully' })
})

// @desc   Post reply
// @route  POST /replies
// @access Private
const postReply = asyncHandler(
  async (req: Request<{}, {}, CreateReplyInput['body']>, res: Response) => {
    const { parentComment, parentArticle, body } = req.body

    if (!parentComment || !body || !parentArticle) {
      res.status(400)
      res.json({ message: 'All fields are required' })
      return
    }

    const replyObject = { user: req.userId, parentComment, parentArticle, body }

    const reply = await ReplyModel.create(replyObject)

    if (reply) {
      await CommentModel.findByIdAndUpdate(parentComment, {
        $inc: { replies: 1 }
      }).exec()
      res.status(201)
      res.json({ message: 'Reply added successfully' })
    } else {
      res.status(400)
      res.json({ message: 'Invalid data received, could not create reply' })
    }
  }
)

// @desc   Update reply
// @route  PATCH /replies
// @access Private
const updateReply = asyncHandler(
  async (req: Request<{}, {}, UpdateReplyInput['body']>, res: Response) => {
    const { replyId, body } = req.body

    if (!replyId || !body) {
      res.status(400)
      res.json({ message: 'All fields are reqiured' })
    }

    const reply = await ReplyModel.findById(replyId)

    if (!reply) {
      res.status(400)
      res.json({ message: 'Reply not found' })
      return
    }

    reply.body = body

    if (reply.edited === false) {
      reply.edited = true
    }

    await reply.save()

    res.json({ message: 'Reply updated successfully' })
  }
)

// @desc   Delete reply
// @route  DELETE /replies
// @access Private
const deleteReply = asyncHandler(async (req: Request, res: Response) => {
  const { replyId } = req.body

  if (!replyId) {
    res.status(400)
    res.json({ message: 'All fields are required' })
    return
  }

  const reply = await ReplyModel.findById(replyId)

  if (!reply) {
    res.status(400)
    res.json({ message: 'Reply not found' })
    return
  }

  reply.deleteOne()

  res.json({ message: 'Successfully deleted reply' })
})

export default {
  getAllreplies,
  checkLikeReply,
  likeReply,
  postReply,
  updateReply,
  deleteReply
}
