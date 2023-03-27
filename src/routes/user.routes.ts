import express from 'express'
import userController from '../controllers/user.controller'
import { createUserSchema } from '../schema/user.schema'
import validate from '../middleware/validateResource'

const router = express.Router()

router.route('/users').get(userController.getAllUsers)

router
  .route('/register')
  .post(validate(createUserSchema), userController.registerUser)

router
  .route('/login')
  .post(validate(createUserSchema), userController.loginUser)

router
  .route('/logout')
  .get(validate(createUserSchema), userController.logoutUser)

export default router
