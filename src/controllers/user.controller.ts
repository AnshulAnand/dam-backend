import { Request, Response } from 'express'
import UserModel from '../models/user.model'
import asyncHandler from 'express-async-handler'
import { CreateUserInput } from '../schema/user.schema'
import bcrypt from 'bcrypt'

// @desc   Get all users
// @route  GET /users
// @access Private
const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await UserModel.find().select('-password').lean()
  if (!users?.length) {
    res.status(400).json({ message: 'No Users Found' })
  } else {
    res.json(users)
  }
})

// @desc   Create new user
// @route  POST /users
// @access Private
const createUser = asyncHandler(
  async (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => {
    const { name, username, email, password } = req.body

    if (!name || !username || !password || !email) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const duplicate = await UserModel.findOne({ username }).lean().exec()

    if (duplicate) {
      res.status(409).json({ message: 'Duplicate username' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userObject = { name, username, password: hashedPassword, email }

    const newUser = await UserModel.create(userObject)

    if (newUser) {
      res
        .status(201)
        .json({ message: `New user ${username} was created successfully` })
    } else {
      res
        .status(400)
        .json({ message: 'Invalid user data received, could not create user' })
    }
  }
)

// @desc   Update user
// @route  PATCH /users
// @access Private
const updateUser = asyncHandler(
  async (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => {
    const { name, username, password, country, bio, link, image } = req.body

    if (!name || !username) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const user = await UserModel.findOne({ username: username }).exec()
    console.log(user)

    if (!user) {
      res.status(400).json({ message: 'User not found' })
      return
    }

    const duplicate = await UserModel.findOne({ username: username })
      .lean()
      .exec()

    // if (duplicate && duplicate.username === username) {
    //   res.status(409).json({ message: 'Duplicate username' })
    //   return
    // }

    user.name = name
    user.username = username

    if (password) user.password = await bcrypt.hash(password, 10)
    if (country) user.country = country
    if (bio) user.bio = bio
    if (link) user.link = link
    if (image) user.image = image

    const updatedUser = await user.save()

    res.json({ message: `${username} updated` })
  }
)

// @desc   Delete user
// @route  DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.body

  if (!username) {
    res.status(400).json({ message: 'Username required' })
    return
  }

  const user = await UserModel.findOne({ username: username }).exec()

  if (!user) {
    res.status(400).json({ message: 'User not found' })
    return
  }

  const result = user.deleteOne()

  res.json(`User ${username} deleted`)
})

export default {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
}
