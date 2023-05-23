import { Schema, model, Types, Document } from 'mongoose'

export interface LikeDocument extends Document {
  user: Types.ObjectId
  parentArticle: Types.ObjectId
}

const likeSchema = new Schema<LikeDocument>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  parentArticle: { type: Schema.Types.ObjectId, required: true, ref: 'Article' }
})

const LikeModel = model<LikeDocument>('CommentLike', likeSchema)

export default LikeModel
