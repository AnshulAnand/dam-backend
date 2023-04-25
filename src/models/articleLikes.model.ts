import { Schema, model, Types, Document } from 'mongoose'

export interface LikeDocument extends Document {
  article: Types.ObjectId
  user: Types.ObjectId
}

const likeSchema = new Schema<LikeDocument>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  article: { type: Schema.Types.ObjectId, required: true, ref: 'Article' }
})

const LikeModel = model<LikeDocument>('ArticleLike', likeSchema)

export default LikeModel
