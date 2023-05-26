import { Schema, model, Types, Document } from 'mongoose'

export interface ArticleDocument extends Document {
  user: Types.ObjectId
  title: string
  url: string
  tags: Array<string>
  description: string
  body: string
  image: string
  views: number
  likes: number
  edited: boolean
}

const articleSchema = new Schema<ArticleDocument>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    description: { type: String },
    body: { type: String, required: true },
    image: { type: String, default: '' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    edited: { type: Boolean, default: false }
  },
  { timestamps: true }
)

const ArticleModel = model<ArticleDocument>('Article', articleSchema)

export default ArticleModel
