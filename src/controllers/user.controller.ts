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
import OtpModel from '../models/otp.model'
import NewsletterModel from '../models/newsletter.model'
import {
  sendRegisterEmail,
  sendLoginEmail,
  sendOtpEmail,
  sendPasswordChangeEmail
} from '../utils/sendEmail'
import AddMinutesToDate from '../utils/addTimeToDate'
import otpGenerator from 'otp-generator'
const nanoid = import('nanoid')
import qs from 'qs'

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

    const userObject = { name, username, email, password: hashedPassword }

    const newUser = await UserModel.create(userObject)

    await NewsletterModel.create({ email })

    const JWT = jwt.sign(
      { userId: newUser._id },
      config.get<string>('jwtSecret'),
      { expiresIn: config.get<string>('jwtTtl') }
    )

    if (!newUser) {
      res
        .status(400)
        .json({ message: 'Invalid user data received, could not create user' })
      return
    }

    res
      .cookie('jwt', JWT, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      .json({ message: 'Registered Successfully' })

    sendRegisterEmail(newUser)
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

    if (!user) {
      res.status(401).json({ message: 'No user found' })
      return
    }

    const comparePasswords = await bcrypt.compare(password, user.password)

    if (!comparePasswords) {
      res.status(401).json({ message: 'Incorrect email or password' })
      return
    }

    const JWT = jwt.sign(
      { userId: user._id },
      config.get<string>('jwtSecret'),
      { expiresIn: config.get<string>('jwtTtl') }
    )

    res
      .cookie('jwt', JWT, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      .json({ message: 'Logged in successfully' })

    sendLoginEmail(user)
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

      // res.cookie('jwt', JWT, {
      //   httpOnly: true,
      //   sameSite: 'none',
      //   secure: true,
      //   maxAge: 24 * 60 * 60 * 1000
      // })

      res.cookie('jwt', JWT, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
      })

      res.redirect(config.get<string>('clientUrl'))

      sendLoginEmail(duplicateEmail)
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

    if (!newUser) {
      res
        .status(400)
        .json({ message: 'Invalid user data received, could not create user' })
      return
    }

    const JWT = jwt.sign(
      { userId: newUser._id },
      config.get<string>('jwtSecret'),
      { expiresIn: config.get<string>('jwtTtl') }
    )

    await NewsletterModel.create({ email: user.email })

    res
      .cookie('jwt', JWT, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      .redirect(config.get<string>('clientUrl'))

    sendRegisterEmail(newUser)
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

  res.clearCookie('jwt', { httpOnly: true }).sendStatus(204)
})

// @desc   Forgot password
// @route  POST /users/forgot-password
// @access Public
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body

    const user = await UserModel.findOne({ email }).lean()

    if (!user) {
      res.status(400).json({ message: 'User not found' })
      return
    }

    //Generate OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: true,
      lowerCaseAlphabets: false,
      specialChars: false
    })

    const now = new Date()

    const expire = AddMinutesToDate(now, 10)

    await OtpModel.create({ otp, expire, user: user._id })

    sendOtpEmail(user, otp)

    res.json({ message: 'OTP sent on your email' })
  }
)

// @desc   Change password
// @route  POST /users/change-password
// @access Public
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp, password } = req.body

    const user = await UserModel.findOne({ email })

    if (!user) {
      res.status(400).json({ message: 'User not found' })
      return
    }

    const stored_otp = await OtpModel.findOne({ otp, user: user._id })

    if (
      !stored_otp ||
      stored_otp.otp !== otp ||
      stored_otp.expire.getTime() <= new Date().getTime()
    ) {
      res.status(400).json({ message: 'Invalid or expired OTP' })
      return
    }

    await stored_otp.deleteOne()

    const encryptedNewPassword = await bcrypt.hash(
      password,
      config.get<number>('saltWorkFactor')
    )

    user.password = encryptedNewPassword

    await user.save()

    res.json({ message: 'Password changed' })

    sendPasswordChangeEmail(user)
  }
)

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
