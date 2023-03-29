import dayjs from 'dayjs'
import { Schema, model, Types, Document } from 'mongoose'

export interface CommentDocument extends Document {
  user: Types.ObjectId
  body: string
  date: string
  likes: number
}

const commentSchema = new Schema<CommentDocument>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  body: { type: String, required: true },
  date: {
    type: String,
    default: dayjs(new Date()).format('DD/MMMM/YYYY'),
    required: true
  },
  likes: { type: Number, default: 0 }
})

const CommentModel = model<CommentDocument>('Comment', commentSchema)

export default CommentModel
