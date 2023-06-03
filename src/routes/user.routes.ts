import express from 'express'
import userController from '../controllers/user.controller'
import {
  createUserSchema,
  updateUserSchema,
  loginUserSchema
} from '../schema/user.schema'
import validate from '../middleware/validateResource'
import verifyJwt from '../middleware/verifyJwt'

const router = express.Router()

router
  .route('/')
  .get(userController.getAllUsers)
  .patch(verifyJwt, validate(updateUserSchema), userController.updateUser)
  .delete(verifyJwt, userController.deleteUser)

router
  .post('/register', validate(createUserSchema), userController.registerUser)
  .post('/login', validate(loginUserSchema), userController.loginUser)
  .get('/logout', verifyJwt, userController.logoutUser)
  .get('/current', verifyJwt, userController.getCurrentUser)
  .get('/username/:username', userController.getUserByUsername)
  .get('/id/:userId', userController.getUserById)

export default router
