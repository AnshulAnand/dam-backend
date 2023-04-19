import express from 'express'
import articleController from '../controllers/article.controller'
import validate from '../middleware/validateResource'
import { createArticleSchema, articleSchema } from '../schema/article.schema'
import verifyJwt from '../middleware/verifyJwt'

const router = express.Router()

router.route('/:articleId').get(articleController.getArticle)

router
  .route('/')
  .get(articleController.getAllArticles)
  .post(
    verifyJwt,
    validate(createArticleSchema),
    articleController.createArticle
  )
  .patch(verifyJwt, validate(articleSchema), articleController.updateArticle)
  .delete(verifyJwt, articleController.deleteArticle)

export default router
