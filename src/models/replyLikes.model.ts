import { Schema, model, Types, Document } from 'mongoose'

export interface LikeDocument extends Document {
  user: string
  parent: Types.ObjectId
}

const likeSchema = new Schema<LikeDocument>({
  user: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, required: true, ref: 'Comment' }
})

const LikeModel = model<LikeDocument>('ReplyLike', likeSchema)

export default LikeModel
