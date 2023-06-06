import express from 'express'
import articleController from '../controllers/article.controller'
import { createArticleSchema, articleSchema } from '../schema/article.schema'
import validate from '../middleware/validateResource'
import verifyJwt from '../middleware/verifyJwt'
import paginatedResults from '../middleware/paginatedResults'
import ArticleModel from '../models/articles/article.model'

const router = express.Router()

router
  .route('/')
  .get(paginatedResults(ArticleModel), articleController.getAllArticles)
  .post(
    verifyJwt,
    validate(createArticleSchema),
    articleController.createArticle
  )
  .patch(verifyJwt, validate(articleSchema), articleController.updateArticle)
  .delete(verifyJwt, articleController.deleteArticle)

router
  .post('/like', verifyJwt, articleController.likeArticle)
  .get('/search', articleController.searchArticle)
  .get('/:url', articleController.getArticle)
  .get('/id/:id', articleController.getArticleById)

export default router
