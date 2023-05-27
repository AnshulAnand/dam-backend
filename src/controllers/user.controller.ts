import { Request, Response } from 'express'
import UserModel from '../models/user.model'
import BasicAuthModel from '../models/auth/basicAuth.model'
import asyncHandler from 'express-async-handler'
import {
  CreateUserInput,
  UpdateUserInput,
  LoginUserInput
} from '../schema/user.schema'
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

// @desc   Get current user
// @route  GET /users/current
// @access Private
const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.userId).select('-password').lean()
  if (!user) {
    res.status(400).json({ message: 'No User Found' })
  } else {
    res.json(user)
  }
})

// @desc   Get user by username
// @route  GET /users/username/:username
// @access Public
const getUserByUsername = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params
  const user = await UserModel.findOne({ username }).select('-password').lean()
  if (!user) {
    res.status(400).json({ message: 'No User Found' })
  } else {
    res.json(user)
  }
})

// @desc   Get user by id
// @route  GET /users/id/:userId
// @access Public
const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params
  const user = await UserModel.findById(userId).select('-password').lean()
  if (!user) {
    res.status(400).json({ message: 'No User Found' })
  } else {
    res.json(user)
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

    const duplicateUsername = await UserModel.findOne({ username }).lean()

    if (duplicateUsername) {
      res.status(409).json({ message: 'Username already exists' })
      return
    }

    const duplicateEmail = await BasicAuthModel.findOne({ email }).lean()

    if (duplicateEmail) {
      res.status(409).json({ message: 'Email already exists' })
      return
    }

    const hashedPassword = await bcrypt.hash(
      password,
      config.get<number>('saltWorkFactor')
    )

    const userObject = { name, username, refreshToken: 'no-token' }

    const newUser = await UserModel.create(userObject)

    const basicAuthObject = {
      password: hashedPassword,
      email,
      user: newUser._id
    }

    const newBasicAuth = await BasicAuthModel.create(basicAuthObject)

    const JWT = jwt.sign(
      { userId: newUser._id },
      config.get<string>('jwtSecret'),
      { expiresIn: config.get<string>('jwtTtl') }
    )

    await newUser.save()

    if (newUser && newBasicAuth) {
      res.cookie('jwt', JWT, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      res.json({ message: 'Registered Successfully' })
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
  async (req: Request<{}, {}, LoginUserInput['body']>, res: Response) => {
    const { email, password } = req.body

    if (!password || !email) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const match = await BasicAuthModel.findOne({ email }).lean()

    if (match) {
      const user = await UserModel.findById(match.user)

      const JWT = jwt.sign(
        { userId: user._id },
        config.get<string>('jwtSecret'),
        { expiresIn: config.get<string>('jwtTtl') }
      )

      await user.save()

      res.cookie('jwt', JWT, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      res.json({ message: 'Logged in successfully' })
    } else {
      res.status(401).json({ message: 'No user found' })
    }
  }
)

// @desc   Logout user
// @route  GET /logout
// @access Private
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId

  if (!userId) {
    res.status(400).json({ message: `User with ID: ${userId} not found` })
    return
  }

  const cookies = req.cookies

  if (!cookies?.jwt) {
    res.sendStatus(204)
    return
  }

  const foundUser = await UserModel.findById(userId).exec()

  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true })
    res.sendStatus(204)
    return
  }

  res.clearCookie('jwt', { httpOnly: true })
  res.sendStatus(204)
})

// @desc   Update user
// @route  PATCH /users
// @access Private
const updateUser = asyncHandler(
  async (req: Request<{}, {}, UpdateUserInput['body']>, res: Response) => {
    const { name, username, country, bio, link, image } = req.body

    const user = await UserModel.findById(req.userId).exec()

    if (!user) {
      res.status(400).json({ message: 'User not found' })
      return
    }

    if (username) user.username = username
    if (name) user.name = name
    if (country) user.country = country
    if (bio) user.bio = bio
    if (link) user.link = link
    if (image) user.image = image

    await user.save()

    res.json({ message: `User updated` })
  }
)

// @desc   Delete user
// @route  DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.userId

  if (!user) {
    res.status(400).json({ message: 'User ID required' })
    return
  }

  const foundUser = await UserModel.findById(user).exec()

  if (!foundUser) {
    res.status(400).json({ message: 'User not found' })
    return
  }

  await foundUser.deleteOne()

  res.json(`${foundUser.username} deleted`)
})

export default {
  getAllUsers,
  getCurrentUser,
  getUserByUsername,
  getUserById,
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser
}
