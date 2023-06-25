import { Schema, model, Document, Types } from 'mongoose'

export interface NewsletterDocument extends Document {
  email: string
}

const newsletterSchema = new Schema<NewsletterDocument>(
  {
    email: { type: String, required: true }
  },
  { timestamps: true }
)

const NewsletterModel = model<NewsletterDocument>(
  'Newsletter',
  newsletterSchema
)

export default NewsletterModel
