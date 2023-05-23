import { Schema, model, Types, Document } from 'mongoose'

export interface OfficialPostDocument extends Document {
  user: Types.ObjectId
  title: string
  url: string
  description: string
  body: string
  image: string
  views: number
  likes: number
  edited: boolean
}

const officialPostSchema = new Schema<OfficialPostDocument>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, default: '' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    edited: { type: Boolean, default: false }
  },
  { timestamps: true }
)

const OfficialPostModel = model<OfficialPostDocument>(
  'OfficialPost',
  officialPostSchema
)

export default OfficialPostModel
