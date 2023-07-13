import { Request, Response } from 'express'
import asyncHanlder from 'express-async-handler'
import NewsletterModel from '../models/newsletter.model'
import {
  SubNewsletterSchema,
  UnsubNewsletterSchema
} from '../schema/newsletter.schema'

// @desc   Subscribe newsletter
// @route  POST /newsletter
// @access Public
const subscribeNewsletter = asyncHanlder(
  async (req: Request<{}, {}, SubNewsletterSchema['body']>, res: Response) => {
    const { email } = req.body

    const duplicateUser = await NewsletterModel.findOne({ email })

    if (duplicateUser) {
      res.status(409).json({ message: 'You are already subscribed' })
      return
    }

    await NewsletterModel.create({ email })

    res.json({ message: 'You are now subscribed to our newsletter' })
  }
)

// @desc   Unsubscribe newsletter
// @route  DELETE /newsletter
// @access Private
const unSubscribeNewsletter = asyncHanlder(
  async (
    req: Request<{}, {}, UnsubNewsletterSchema['body']>,
    res: Response
  ) => {
    const { id } = req.body

    const newsletter = await NewsletterModel.findByIdAndDelete(id)

    if (!newsletter) {
      res.status(409).json({ message: 'Email not found' })
      return
    }

    res.json({ message: 'You unsubscribed from our newsletter' })
  }
)

export default {
  subscribeNewsletter,
  unSubscribeNewsletter
}
