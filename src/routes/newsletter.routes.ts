import express from 'express'
import newsletterController from '../controllers/newsletter.controller'

const router = express.Router()

router
  .route('/')
  .post(newsletterController.subscribeNewsletter)
  .delete(newsletterController.unSubscribeNewsletter)

export default router
