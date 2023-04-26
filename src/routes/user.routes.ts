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
  .get('/:userId', userController.getUser)
  .post('/register', validate(createUserSchema), userController.registerUser)
  .post('/login', validate(loginUserSchema), userController.loginUser)
  .get('/logout', verifyJwt, userController.logoutUser)
  .get('/refresh', userController.handleRefreshToken)

export default router
