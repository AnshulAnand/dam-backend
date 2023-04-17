import { Request, Response } from 'express'
import UserModel from '../models/user.model'
import asyncHandler from 'express-async-handler'
import { CreateUserInput, LoginUserInput } from '../schema/user.schema'
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

// @desc   Get user
// @route  GET /users/user
// @access Private
const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.body

  const user = await UserModel.findOne({ username }).select('-password').lean()

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

    const duplicate = await UserModel.findOne({ username }).lean().exec()

    if (duplicate) {
      res.status(409).json({ message: 'Username already exists' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const accessToken = jwt.sign(
      { username },
      config.get<string>('accessTokenSecret'),
      { expiresIn: '30s' }
    )

    const refreshToken = jwt.sign(
      { username },
      config.get<string>('refreshTokenSecret'),
      { expiresIn: '1d' }
    )

    const userObject = {
      name,
      username,
      password: hashedPassword,
      email,
      refreshToken
    }

    const newUser = await UserModel.create(userObject)

    await newUser.save()

    if (newUser) {
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      res.json({ accessToken })
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

    const match = await UserModel.findOne({ email }).exec()
    console.log(match)

    if (match) {
      const accessToken = jwt.sign(
        { username: match.username },
        config.get<string>('accessTokenSecret'),
        { expiresIn: '30s' }
      )

      const refreshToken = jwt.sign(
        { username: match.username },
        config.get<string>('refreshTokenSecret'),
        { expiresIn: '1d' }
      )

      match.refreshToken = refreshToken
      await match.save()

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      res.json({ accessToken })
    } else {
      res.status(401).json({ message: 'No user found' })
    }
  }
)

// @desc   Logout user
// @route  POST /logout
// @access Private
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const username = req.user

  if (!username) {
    res.status(400).json({ message: `User ${username} not found` })
    return
  }

  const cookies = req.cookies

  if (!cookies?.jwt) {
    res.sendStatus(204)
    return
  }

  console.log(cookies.jwt)

  const refreshToken = cookies.jwt

  const foundUser = await UserModel.findOne({ refreshToken }).exec()

  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true })
    res.sendStatus(204)
    return
  }

  foundUser.refreshToken = 'no-token'

  await foundUser.save()

  res.clearCookie('jwt', { httpOnly: true })
  res.sendStatus(204)
})

// @desc   Update user
// @route  PATCH /users
// @access Private
const updateUser = asyncHandler(
  async (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => {
    const { name, username, password, country, bio, link, image } = req.body

    if (!username) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const user = await UserModel.findOne({ username: req.user }).exec()
    console.log(user)

    if (!user) {
      res.status(400).json({ message: 'User not found' })
      return
    }

    user.username = username

    if (user) user.name = name
    if (password) user.password = await bcrypt.hash(password, 10)
    if (country) user.country = country
    if (bio) user.bio = bio
    if (link) user.link = link
    if (image) user.image = image

    await user.save()

    res.json({ message: `${username} updated` })
  }
)

// @desc   Delete user
// @route  DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const username = req.user

  if (!username) {
    res.status(400).json({ message: 'Username required' })
    return
  }

  const user = await UserModel.findOne({ username }).exec()

  if (!user) {
    res.status(400).json({ message: 'User not found' })
    return
  }

  await user.deleteOne()

  res.json(`${username} deleted`)
})

// @desc   Handle refresh token
// @route  GET /users/refresh
// @access Private
const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies?.jwt) {
    res.sendStatus(401)
    return
  }

  console.log(cookies.jwt)

  const refreshToken: string = cookies.jwt

  const foundUser = await UserModel.findOne({ refreshToken }).exec()

  if (!foundUser) {
    res.sendStatus(403)
    return
  }

  jwt.verify(
    refreshToken,
    config.get<string>('refreshTokenSecret'),
    (err, decoded: jwt.JwtPayload) => {
      if (err || foundUser.username !== decoded.username) {
        res.sendStatus(403)
        return
      }

      const accessToken = jwt.sign(
        { username: decoded.username },
        config.get<string>('accessTokenSecret'),
        { expiresIn: '30s' }
      )

      res.json({ accessToken })
    }
  )
}

export default {
  getAllUsers,
  getUser,
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  handleRefreshToken
}
