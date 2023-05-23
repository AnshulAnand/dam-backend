import { Schema, model, Types, Document } from 'mongoose'

export interface LikeDocument extends Document {
  user: Types.ObjectId
  parentArticle: Types.ObjectId
}

const likeSchema = new Schema<LikeDocument>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  parentArticle: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'OfficialPost'
  }
})

const LikeModel = model<LikeDocument>('OfficialPostsCommentLike', likeSchema)

export default LikeModel
