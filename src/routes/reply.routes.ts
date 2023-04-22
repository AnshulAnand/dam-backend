import express from 'express'
import validate from '../middleware/validateResource'
import verifyJwt from '../middleware/verifyJwt'
import { createReplySchema, updateReplySchema } from '../schema/reply.schema'
import replyController from '../controllers/reply.controller'

const router = express.Router()

router
  .route('/')
  .get(replyController.getAllreplies)
  .post(verifyJwt, validate(createReplySchema), replyController.postReply)
  .patch(verifyJwt, validate(updateReplySchema), replyController.updateReply)
  .delete(verifyJwt, replyController.deleteReply)

export default router
