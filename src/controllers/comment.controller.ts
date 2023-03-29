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
const postComment = asyncHandler(async (req: Request, res: Response) => {})

// @desc   Update comment
// @route  PATCH /comments
// @access Private
const updateComment = asyncHandler(async (req: Request, res: Response) => {})

// @desc   Delete comment
// @route  DELETE /comments
// @access Private
const deleteComment = asyncHandler(async (req: Request, res: Response) => {})

export default {
  getAllComments,
  postComment,
  updateComment,
  deleteComment
}
