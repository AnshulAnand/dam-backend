import { Schema, model, Types, Document } from 'mongoose'

export interface LikeDocument extends Document {
  article: Types.ObjectId
  user: Types.ObjectId
}

const likeSchema = new Schema<LikeDocument>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  article: { type: Schema.Types.ObjectId, required: true, ref: 'OfficialPost' }
})

const LikeModel = model<LikeDocument>('OfficialPostsLike', likeSchema)

export default LikeModel
