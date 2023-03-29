import dayjs from 'dayjs'
import { Schema, model, Types, Document } from 'mongoose'

export interface ImageDocument extends Document {
  url: string
}

export interface ArticleDocument extends Document {
  user: Types.ObjectId
  title: string
  url: string
  body: string
  images: Types.DocumentArray<ImageDocument>
  date: string
  views: number
  likes: number
  comments: {
    type: typeof Schema.Types.ObjectId
    ref: string
  }[]
}

const ImageSchema = new Schema<ImageDocument>({
  url: { type: String, default: '' }
})

const articleSchema = new Schema<ArticleDocument>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  body: { type: String, required: true },
  images: [ImageSchema],
  date: {
    type: String,
    default: dayjs(new Date()).format('DD/MMMM/YYYY'),
    required: true
  },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
})

const ArticleModel = model<ArticleDocument>('Article', articleSchema)

export default ArticleModel
