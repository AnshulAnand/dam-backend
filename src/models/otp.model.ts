import { Schema, model, Document, Types } from 'mongoose'

export interface OtpDocument extends Document {
  user: Types.ObjectId
  otp: string
  expire: Date
}

const otpSchema = new Schema<OtpDocument>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    otp: { type: String, required: true, unique: true },
    expire: { type: Date, required: true }
  },
  { timestamps: true }
)

const OtpModel = model<OtpDocument>('Otp', otpSchema)

export default OtpModel
