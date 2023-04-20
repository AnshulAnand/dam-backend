import { Schema, model, Types, Document } from 'mongoose'

export interface LikeDocument extends Document {
  article: string
  user: string
}

const likeSchema = new Schema<LikeDocument>({
  user: { type: String, required: true },
  article: { type: String, required: true }
})

const LikeModel = model<LikeDocument>('Like', likeSchema)

export default LikeModel
