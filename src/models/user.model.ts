import { Schema, model } from 'mongoose'

interface User {
  name: string
  username: string
  email: string
  password: string
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
)

const UserModel = model<User>('User', userSchema)

export default UserModel
