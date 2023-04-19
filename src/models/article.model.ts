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
  date: Date
  views: number
  likes: number
  comments: {
    type: typeof Schema.Types.ObjectId
    ref: string
  }[]
  edited: boolean
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
  date: { type: Date, default: Date.now, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  edited: { type: Boolean, default: false }
})

const ArticleModel = model<ArticleDocument>('Article', articleSchema)

export default ArticleModel
