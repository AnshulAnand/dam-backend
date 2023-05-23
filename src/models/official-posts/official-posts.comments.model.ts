import { Schema, model, Types, Document } from 'mongoose'

export interface CommentDocument extends Document {
  user: Types.ObjectId
  parentArticle: Types.ObjectId
  body: string
  likes: number
  edited: boolean
}

const commentSchema = new Schema<CommentDocument>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    parentArticle: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'OfficialPost'
    },
    body: { type: String, required: true },
    likes: { type: Number, default: 0 },
    edited: { type: Boolean, default: false }
  },
  { timestamps: true }
)

const CommentModel = model<CommentDocument>(
  'OfficialPostsComment',
  commentSchema
)

export default CommentModel
