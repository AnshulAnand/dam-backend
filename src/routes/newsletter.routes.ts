import express from 'express'
import newsletterController from '../controllers/newsletter.controller'
import validate from '../middleware/validateResource'
import { subNewsletterSchema } from '../schema/newsletter.schema'

const router = express.Router()

router
  .post(
    '/',
    validate(subNewsletterSchema),
    newsletterController.subscribeNewsletter
  )
  .delete('/:id', newsletterController.unSubscribeNewsletter)

export default router
