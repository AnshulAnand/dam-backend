import { Schema, model, Document, Types } from 'mongoose'

export interface NewsletterDocument extends Document {
  user: Types.ObjectId
}

const newsletterSchema = new Schema<NewsletterDocument>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
  },
  { timestamps: true }
)

const NewsletterModel = model<NewsletterDocument>(
  'Newsletter',
  newsletterSchema
)

export default NewsletterModel
