import express from 'express'
import validate from '../middleware/validateResource'
import verifyJwt from '../middleware/verifyJwt'
import commentController from '../controllers/comment.controller'
import {
  createCommentSchema,
  updateCommentSchema
} from '../schema/comment.shema'

const router = express.Router()

router
  .route('/')
  .get(commentController.getAllComments)
  .post(verifyJwt, validate(createCommentSchema), commentController.postComment)
  .patch(
    verifyJwt,
    validate(updateCommentSchema),
    commentController.updateComment
  )
  .delete(verifyJwt, commentController.deleteComment)

router
  .get('/check-like', verifyJwt, commentController.checkLikeComment)
  .post('/like', verifyJwt, commentController.likeComment)
  .get('/id/:id', verifyJwt, commentController.getComment)
  .get('/:articleId', verifyJwt, commentController.getUserComment)

export default router
