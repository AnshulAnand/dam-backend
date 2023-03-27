import { Request, Response } from 'express'
import UserModel from '../models/user.model'
import asyncHandler from 'express-async-handler'
import { CreateUserInput } from '../schema/user.schema'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from 'config'

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

// @desc   Create and register new user
// @route  POST /register
// @access Private
const registerUser = asyncHandler(
  async (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => {
    const { name, username, email, password } = req.body

    if (!name || !username || !password || !email) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const duplicate = await UserModel.findOne({ username }).lean().exec()

    if (duplicate) {
      res.status(409).json({ message: 'Username already exists' })
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

// @desc   Login user
// @route  POST /login
// @access Private
const loginUser = asyncHandler(
  async (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => {
    const { email, password } = req.body

    if (!password || !email) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const match = await UserModel.findOne({ email }).select('-password').lean()
    console.log(match)

    if (match) {
      const accessToken = jwt.sign(
        match,
        config.get<string>('accessTokenSecret'),
        { expiresIn: '30s' }
      )

      const refreshToken = jwt.sign(
        match,
        config.get<string>('refreshTokenSecret'),
        { expiresIn: '1d' }
      )

      const user = await UserModel.findOne({ email }).exec()
      user.refreshToken = refreshToken
      await user.save()

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      res.json(accessToken)
    } else {
      res.status(401).json({ message: 'No user found' })
    }
  }
)

// @desc   Logout user
// @route  POST /logout
// @access Private
const logoutUser = asyncHandler(
  async (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => {
    const { username } = req.body

    if (!username) {
      res.status(400).json({ message: 'All fields are required' })
      return
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
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser
}
