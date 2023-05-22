import { Request, Response } from 'express'
import CommentModel from '../models/comment.model'
import ReplyModel from '../models/reply.model'
import LikeModel from '../models/replyLikes.model'
import { CreateReplyInput, UpdateReplyInput } from '../schema/reply.schema'
import asyncHandler from 'express-async-handler'

// @desc   Get all replies
// @route  GET /replies
// @access Public
const getAllreplies = asyncHandler(async (req: Request, res: Response) => {
  const results = res.paginatedResults
  if (!results || results.results.length === 0) {
    res.status(400).json({ message: 'No replies found' })
    return
  }
  res.json(results)
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

  const liked = await LikeModel.findById(replyId)

  if (!liked) {
    const reply = await ReplyModel.findById(replyId)

    if (!reply) {
      res.status(400).json({ message: 'Reply Not Found' })
      return
    }

    reply.likes += 1
    await reply.save()

    const likeObject = { user: req.userId, parentComment }

    await LikeModel.create(likeObject)

    res.json({ message: 'Like updated successfully' })
  } else {
    const reply = await ReplyModel.findById(replyId)

    if (!reply) {
      res.status(400).json({ message: 'Reply Not Found' })
      return
    }

    reply.likes -= 1
    await reply.save()

    await liked.deleteOne()

    res.json({ message: 'Like updated successfully' })
  }
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
  likeReply,
  postReply,
  updateReply,
  deleteReply
}
