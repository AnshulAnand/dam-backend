import express from 'express'
import validate from '../../middleware/validateResource'
import verifyJwt from '../../middleware/verifyJwt'
import paginatedResults from '../../middleware/paginatedResults'
import commentController from '../../controllers/official-posts/official-posts.comments.controller'
import CommentModel from '../../models/official-posts/official-posts.comments.model'
import {
  createCommentSchema,
  updateCommentSchema
} from '../../schema/comment.shema'

const router = express.Router()

router
  .route('/')
  .get(paginatedResults(CommentModel), commentController.getAllComments)
  .post(verifyJwt, validate(createCommentSchema), commentController.postComment)
  .patch(
    verifyJwt,
    validate(updateCommentSchema),
    commentController.updateComment
  )
  .delete(verifyJwt, commentController.deleteComment)

router.post('/like', verifyJwt, commentController.likeComment)

export default router
