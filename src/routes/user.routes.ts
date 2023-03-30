import express from 'express'
import userController from '../controllers/user.controller'
import { createUserSchema, loginUserSchema } from '../schema/user.schema'
import validate from '../middleware/validateResource'
import verifyJwt from '../middleware/verifyJwt'

const router = express.Router()

router
  .route('/')
  .get(userController.getAllUsers)
  .patch(verifyJwt, userController.updateUser)
  .delete(verifyJwt, userController.deleteUser)

router.route('/:userId').get(userController.getUser)

router
  .route('/register')
  .post(validate(createUserSchema), userController.registerUser)

router.route('/login').post(validate(loginUserSchema), userController.loginUser)

router.route('/logout').get(verifyJwt, userController.logoutUser)

router.route('/refresh').get(userController.handleRefreshToken)

export default router
