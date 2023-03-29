import express from 'express'
import validate from '../middleware/validateResource'
import verifyJwt from '../middleware/verifyJwt'
import { createCommentSchema } from '../schema/comment.shema'
import commentController from '../controllers/comment.controller'

const router = express.Router()

router
  .route('/')
  .get(commentController.getAllComments)
  .post(verifyJwt, validate(createCommentSchema), commentController.postComment)
  .patch(
    verifyJwt,
    validate(createCommentSchema),
    commentController.updateComment
  )
  .delete(verifyJwt, commentController.deleteComment)

export default router
