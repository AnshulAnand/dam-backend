import { Schema, model, Types, Document } from 'mongoose'

export interface LikeDocument extends Document {
  user: Types.ObjectId
  parent: Types.ObjectId
}

const likeSchema = new Schema<LikeDocument>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  parent: { type: Schema.Types.ObjectId, required: true, ref: 'Comment' }
})

const LikeModel = model<LikeDocument>('CommentLike', likeSchema)

export default LikeModel
