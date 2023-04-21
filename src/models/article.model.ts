import { Schema, model, Types, Document } from 'mongoose'

export interface ArticleDocument extends Document {
  user: Types.ObjectId
  title: string
  url: string
  body: string
  images: string
  views: number
  likes: number
  comments: {
    type: typeof Schema.Types.ObjectId
    ref: string
  }[]
  edited: boolean
}

const articleSchema = new Schema<ArticleDocument>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    body: { type: String, required: true },
    images: { type: String, default: '' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    edited: { type: Boolean, default: false }
  },
  { timestamps: true }
)

const ArticleModel = model<ArticleDocument>('Article', articleSchema)

export default ArticleModel
