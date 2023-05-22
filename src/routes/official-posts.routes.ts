import express from 'express'
import validate from '../middleware/validateResource'
import verifyJwt from '../middleware/verifyJwt'
import paginatedResults from '../middleware/paginatedResults'
import OfficialPostModel from '../models/official-posts.model'
import officialPostsController from '../controllers/official-posts.controller'
import { createPostSchema, postSchema } from '../schema/official-posts.schema'

const router = express.Router()

router
  .route('/')
  .get(
    paginatedResults(OfficialPostModel),
    officialPostsController.getAllArticles
  )
  .post(
    verifyJwt,
    validate(createPostSchema),
    officialPostsController.createArticle
  )
  .patch(verifyJwt, validate(postSchema), officialPostsController.updateArticle)
  .delete(verifyJwt, officialPostsController.deleteArticle)

router
  .get('/:url', officialPostsController.getArticle)
  .post('/like', verifyJwt, officialPostsController.likeArticle)

export default router
