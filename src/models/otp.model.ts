import { Schema, model, Document } from 'mongoose'

export interface OtpDocument extends Document {
  otp: string
  verified: boolean
  expire: Date
}

const otpSchema = new Schema<OtpDocument>(
  {
    otp: { type: String, required: true, unique: true },
    verified: { type: Boolean, required: true, default: false },
    expire: { type: Date, required: true }
  },
  { timestamps: true }
)

const OtpModel = model<OtpDocument>('Otp', otpSchema)

export default OtpModel
