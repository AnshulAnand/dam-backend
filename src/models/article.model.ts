import mongoose from 'mongoose'

export interface ArticleInput {
  title: string
  body: string
}

export interface ArticleDocument extends ArticleInput, mongoose.Document {
  createdAt: Date
  updatedAt: Date
}

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

const ArticleModel = mongoose.model<ArticleDocument>('Article', articleSchema)

export default ArticleModel
