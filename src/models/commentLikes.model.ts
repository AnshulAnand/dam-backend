import { Schema, model, Types, Document } from 'mongoose'

export interface LikeDocument extends Document {
  user: string
  parent: string
}

const likeSchema = new Schema<LikeDocument>({
  user: { type: String, required: true },
  parent: { type: String, required: true }
})

const LikeModel = model<LikeDocument>('CommentLike', likeSchema)

export default LikeModel
