import { Schema, model, Types, Document } from 'mongoose'

export interface LikeDocument extends Document {
  user: Types.ObjectId
  parentComment: Types.ObjectId
}

const likeSchema = new Schema<LikeDocument>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  parentComment: { type: Schema.Types.ObjectId, required: true, ref: 'Comment' }
})

const LikeModel = model<LikeDocument>('ReplyLike', likeSchema)

export default LikeModel
