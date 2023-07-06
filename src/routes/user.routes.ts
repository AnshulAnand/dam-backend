import {
  createUserSchema,
  updateUserSchema,
  loginUserSchema
} from '../schema/user.schema'
import {
  updateUser,
  deleteUser,
  registerUser,
  googleOAuthRegister,
  loginUser,
  logoutUser,
  getCurrentUser,
  getUserByUsername,
  getUserById,
  forgotPassword,
  changePassword
} from '../controllers/user.controller'
import validate from '../middleware/validateResource'
import verifyJwt from '../middleware/verifyJwt'
import express from 'express'

const router = express.Router()

router
  .route('/')
  .patch(verifyJwt, validate(updateUserSchema), updateUser)
  .delete(verifyJwt, deleteUser)

router
  .get('/oauth/google', googleOAuthRegister)
  .post('/register', validate(createUserSchema), registerUser)
  .post('/login', validate(loginUserSchema), loginUser)
  .post('/forgot-password', forgotPassword)
  .post('/change-password', changePassword)
  .get('/logout', verifyJwt, logoutUser)
  .get('/current', verifyJwt, getCurrentUser)
  .get('/username/:username', getUserByUsername)
  .get('/id/:userId', getUserById)

export default router
