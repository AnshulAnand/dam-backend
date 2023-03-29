import dayjs from 'dayjs'
import { Schema, model, Document } from 'mongoose'

export interface UserDocument extends Document {
  name?: string
  username: string
  email: string
  password: string
  refreshToken: string
  date: string
  country?: string
  bio?: string
  link?: string
  image?: string
  views?: number
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, default: '' },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String, required: true },
  date: {
    type: String,
    default: dayjs(new Date()).format('DD/MMMM/YYYY'),
    required: true
  },
  country: { type: String, default: '' },
  bio: { type: String, default: '' },
  link: { type: String, default: '' },
  image: { type: String, default: '' },
  views: { type: Number, default: 0 }
})

const UserModel = model<UserDocument>('User', userSchema)

export default UserModel
