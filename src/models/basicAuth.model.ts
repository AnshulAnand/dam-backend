import { Schema, model, Types, Document } from 'mongoose'

export interface BasicAuthDocument extends Document {
  email: string
  password: string
  user: Types.ObjectId
}

const basicAuthSchema = new Schema<BasicAuthDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
  },
  { timestamps: true }
)

const BasicAuthModel = model<BasicAuthDocument>('BasicAuth', basicAuthSchema)

export default BasicAuthModel
