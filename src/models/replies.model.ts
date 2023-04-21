import { Schema, model, Types, Document } from 'mongoose'

export interface ReplyDocument extends Document {
  user: Types.ObjectId
  parent: Types.ObjectId
  body: string
  likes: number
  edited: boolean
}

const replySchema = new Schema<ReplyDocument>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    parent: { type: Schema.Types.ObjectId, required: true, ref: 'Comment' },
    body: { type: String, required: true },
    likes: { type: Number, default: 0 },
    edited: { type: Boolean, default: false }
  },
  { timestamps: true }
)

const ReplyModel = model<ReplyDocument>('Replies', replySchema)

export default ReplyModel
