import express from 'express'
import validate from '../middleware/validateResource'
import verifyJwt from '../middleware/verifyJwt'
import paginatedResults from '../middleware/paginatedResults'
import { createReplySchema, updateReplySchema } from '../schema/reply.schema'
import replyController from '../controllers/reply.controller'
import ReplyModel from '../models/reply.model'

const router = express.Router()

router
  .route('/')
  .get(paginatedResults(ReplyModel), replyController.getAllreplies)
  .post(verifyJwt, validate(createReplySchema), replyController.postReply)
  .patch(verifyJwt, validate(updateReplySchema), replyController.updateReply)
  .delete(verifyJwt, replyController.deleteReply)

export default router
