import express from 'express'
import articleController from '../controllers/article.controller'
import validate from '../middleware/validateResource'
import { createArticleSchema } from '../schema/article.schema'

const router = express.Router()

router
  .route('/')
  .get(articleController.getAllArticles)
  .post(validate(createArticleSchema), articleController.createArticle)
  .patch(validate(createArticleSchema), articleController.updateArticle)
  .delete(validate(createArticleSchema), articleController.deleteArticle)

export default router
