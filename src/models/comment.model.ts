import { Schema, model, Types, Document } from 'mongoose'

export interface CommentDocument extends Document {
  user: string
  parent: string
  body: string
  likes: number
  replies: {
    type: typeof Schema.Types.ObjectId
    ref: string
  }[]
  edited: boolean
}

const commentSchema = new Schema<CommentDocument>(
  {
    user: { type: String, required: true },
    parent: { type: String, required: true },
    body: { type: String, required: true },
    likes: { type: Number, default: 0 },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Replies' }],
    edited: { type: Boolean, default: false }
  },
  { timestamps: true }
)

const CommentModel = model<CommentDocument>('Comment', commentSchema)

export default CommentModel
