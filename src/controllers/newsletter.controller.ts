import { Request, Response } from 'express'
import asyncHanlder from 'express-async-handler'
import NewsletterModel from '../models/newsletter.model'
import { NewsletterSchema } from '../schema/newsletter.schema'

// @desc   Subscribe newsletter
// @route  POST /newsletter
// @access Public
const subscribeNewsletter = asyncHanlder(
  async (req: Request<{}, {}, NewsletterSchema['body']>, res: Response) => {
    const { user } = req.body

    const duplicateUser = await NewsletterModel.findOne({ user })

    if (duplicateUser) {
      res.status(409).json({ message: 'You are already subscribed' })
      return
    }

    await NewsletterModel.create({ user })

    res.json({ message: 'You are subscribed to our newsletter' })
  }
)

// @desc   Unsubscribe newsletter
// @route  DELETE /newsletter
// @access Public
const unSubscribeNewsletter = asyncHanlder(
  async (req: Request<{}, {}, NewsletterSchema['body']>, res: Response) => {
    const { user } = req.body

    const newsletter = await NewsletterModel.findOne({ user })

    if (!newsletter) {
      res.status(409).json({ message: 'Email not found' })
      return
    }

    await newsletter.deleteOne()

    res.json({ message: 'You unsubscribed from our newsletter' })
  }
)

export default {
  subscribeNewsletter,
  unSubscribeNewsletter
}
