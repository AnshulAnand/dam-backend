import express from 'express'
import articleController from '../controllers/article.controller'
import {
  createArticleSchema,
  updateArticleSchema,
  searchArticleSchema
} from '../schema/article.schema'
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
  .patch(
    verifyJwt,
    validate(updateArticleSchema),
    articleController.updateArticle
  )
  .delete(verifyJwt, articleController.deleteArticle)

router
  .get('/check-like', verifyJwt, articleController.checkLikeArticle)
  .post('/like', verifyJwt, articleController.likeArticle)
  .get(
    '/search',
    validate(searchArticleSchema),
    articleController.searchArticle
  )
  .get('/user/:userId', articleController.getUserArticles)
  .get('/:url', articleController.getArticle)
  .get('/id/:id', articleController.getArticleById)

export default router
