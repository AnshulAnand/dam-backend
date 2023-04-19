import { Schema, model, Types, Document } from 'mongoose'

export interface ReplyDocument extends Document {
  user: Types.ObjectId
  parent: Types.ObjectId
  body: string
  date: Date
  likes: number
  edited: boolean
}

const commentSchema = new Schema<ReplyDocument>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  parent: { type: Schema.Types.ObjectId, required: true, ref: 'Comment' },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  likes: { type: Number, default: 0 },
  edited: { type: Boolean, default: false }
})

const ReplyModel = model<ReplyDocument>('Replies', commentSchema)

export default ReplyModel
