import express from 'express'
import {
  createArticleHandler,
  deleteArticleHandler,
  getArticleHandler,
  updateArticleHandler
} from '../controller/article.controller'
import requireUser from '../middleware/requireUser'
import validateResource from '../middleware/validateResource'
import {
  createArticleSchema,
  deleteArticleSchema,
  getArticleSchema,
  updateArticleSchema
} from '../schema/article.schema'

const router = express.Router()

router
  .route('/')
  .post(
    [requireUser, validateResource(createArticleSchema)],
    createArticleHandler
  )

router
  .route('/:articleId')
  .get([requireUser, validateResource(getArticleSchema)], getArticleHandler)
  .put(
    [requireUser, validateResource(updateArticleSchema)],
    updateArticleHandler
  )
  .delete(
    [requireUser, validateResource(deleteArticleSchema)],
    deleteArticleHandler
  )

export default router
