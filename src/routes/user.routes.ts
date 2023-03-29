import express from 'express'
import userController from '../controllers/user.controller'
import {
  createUserSchema,
  loginUserSchema,
  logoutUserSchema
} from '../schema/user.schema'
import validate from '../middleware/validateResource'

const router = express.Router()

router
  .route('/')
  .get(userController.getAllUsers)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

router.route('/:userId').get(userController.getUser)

router
  .route('/register')
  .post(validate(createUserSchema), userController.registerUser)

router.route('/login').post(validate(loginUserSchema), userController.loginUser)

router
  .route('/logout')
  .get(validate(logoutUserSchema), userController.logoutUser)

router.route('/refresh').get(userController.handleRefreshToken)

export default router
