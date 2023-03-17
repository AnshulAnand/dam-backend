import mongoose from 'mongoose'
import { customAlphabet } from 'nanoid'
import { UserDocument } from '../models/user.model'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10)

export interface ArticleDocument extends mongoose.Document {
  user: UserDocument['_id']
  url: string
  title: string
  body: string
  image: string
  createdAt: Date
  updatedAt: Date
}

const articleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    url: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, required: true }
  },
  { timestamps: true }
)

const ArticleModel = mongoose.model<ArticleDocument>('Article', articleSchema)

export default ArticleModel
