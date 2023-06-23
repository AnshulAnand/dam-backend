import {
  CreateUserInput,
  UpdateUserInput,
  LoginUserInput
} from '../schema/user.schema'
import axios from 'axios'
import bcrypt from 'bcrypt'
import config from 'config'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import UserModel from '../models/user.model'
import BasicAuthModel from '../models/auth/basicAuth.model'
import NewsletterModel from '../models/newsletter.model'
const nanoid = import('nanoid')
import qs from 'qs'
import { sendEmail } from '../utils/sendEmail'

// @desc   Get all users
// @route  GET /users
// @access Private
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
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
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.userId).select('-password').lean()
    if (!user) {
      res.status(400).json({ message: 'No User Found' })
    } else {
      res.json(user)
    }
  }
)

// @desc   Get user by username
// @route  GET /users/username/:username
// @access Public
export const getUserByUsername = asyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.params
    const user = await UserModel.findOne({ username })
      .select('-password')
      .lean()
    if (!user) {
      res.status(400).json({ message: 'No User Found' })
    } else {
      res.json(user)
    }
  }
)

// @desc   Get user by id
// @route  GET /users/id/:userId
// @access Public
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
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
export const registerUser = asyncHandler(
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

    const duplicateEmail = await UserModel.findOne({ email }).lean()

    if (duplicateEmail) {
      res.status(409).json({ message: 'Email already exists' })
      return
    }

    const hashedPassword = await bcrypt.hash(
      password,
      config.get<number>('saltWorkFactor')
    )

    const userObject = { name, username, email }

    const newUser = await UserModel.create(userObject)

    const basicAuthObject = {
      password: hashedPassword,
      user: newUser._id
    }

    const newBasicAuth = await BasicAuthModel.create(basicAuthObject)

    await NewsletterModel.create({ email })

    const JWT = jwt.sign(
      { userId: newUser._id },
      config.get<string>('jwtSecret'),
      { expiresIn: config.get<string>('jwtTtl') }
    )

    if (newUser && newBasicAuth) {
      res.cookie('jwt', JWT, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
      })

      res.json({ message: 'Registered Successfully' })

      sendEmail(newUser.name, newUser.email)
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
export const loginUser = asyncHandler(
  async (req: Request<{}, {}, LoginUserInput['body']>, res: Response) => {
    const { email, password } = req.body

    if (!password || !email) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const user = await UserModel.findOne({ email })

    if (user) {
      const basicAuth = await BasicAuthModel.findById(user._id)

      const comparePasswords = await bcrypt.compare(
        password,
        basicAuth.password
      )

      if (!comparePasswords) {
        res.status(401).json({ message: 'Incorrect email or password' })
        return
      }

      const JWT = jwt.sign(
        { userId: user._id },
        config.get<string>('jwtSecret'),
        { expiresIn: config.get<string>('jwtTtl') }
      )

      res.cookie('jwt', JWT, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      })

      res.json({ message: 'Logged in successfully' })

      sendEmail(user.name, user.email)
    } else {
      res.status(401).json({ message: 'No user found' })
    }
  }
)

// @desc   Register/login user via google oauth
// @route  GET /users/oauth/google
// @access Public
export const googleOAuthRegister = asyncHandler(
  async (req: Request, res: Response) => {
    const { code } = req.query

    const url = 'https://oauth2.googleapis.com/token'

    const values = {
      code,
      client_id: config.get<string>('googleClientId'),
      client_secret: config.get<string>('googleClientSecret'),
      redirect_uri: config.get<string>('googleOAuthRedirectUrl'),
      grant_type: 'authorization_code'
    }

    const response = await axios.post(url, qs.stringify(values), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })

    const { id_token } = await response.data

    const user: any = jwt.decode(id_token)

    const nanoId = (await nanoid).customAlphabet('abcde0123456789', 3)

    const username = user.name.replace(/ /g, '-') + '-' + nanoId()

    const duplicateEmail = await UserModel.findOne({ email: user.email }).lean()

    if (duplicateEmail) {
      const JWT = jwt.sign(
        { userId: duplicateEmail._id },
        config.get<string>('jwtSecret'),
        { expiresIn: config.get<string>('jwtTtl') }
      )

      res.cookie('jwt', JWT, {
        httpOnly: true,
        // sameSite: 'none',
        // secure: true,
        maxAge: 24 * 60 * 60 * 1000
      })

      res.redirect(config.get<string>('clientUrl'))

      sendEmail(duplicateEmail.name, duplicateEmail.email)
      return
    }

    const duplicateUsername = await UserModel.findOne({ username }).lean()

    if (duplicateUsername) {
      res.status(409).json({ message: 'Username already exists' })
      return
    }

    const userObject = {
      name: user.name,
      username,
      email: user.email,
      image: user.picture
    }

    const newUser = await UserModel.create(userObject)

    await NewsletterModel.create({ user: newUser._id })

    const JWT = jwt.sign(
      { userId: newUser._id },
      config.get<string>('jwtSecret'),
      { expiresIn: config.get<string>('jwtTtl') }
    )

    if (newUser) {
      res.cookie('jwt', JWT, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
      })

      res.redirect(config.get<string>('clientUrl'))

      sendEmail(newUser.name, newUser.email)
    } else {
      res.status(400).json({
        message: 'Invalid user data received, could not create user'
      })
    }
  }
)

// @desc   Logout user
// @route  GET /logout
// @access Private
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
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
export const updateUser = asyncHandler(
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

    const updatedUser = await user.save()

    res.json({ message: updatedUser })
  }
)

// @desc   Delete user
// @route  DELETE /users
// @access Private
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
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
