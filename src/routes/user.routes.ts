import express from 'express'
import userController from '../controllers/user.controller'
import validate from '../middleware/validateResource'
import { createUserSchema } from '../schema/user.schema'

const router = express.Router()

router
  .route('/')
  .get(userController.getAllUsers)
  .post(validate(createUserSchema), userController.createUser)
  .patch(validate(createUserSchema), userController.updateUser)
  .delete(validate(createUserSchema), userController.deleteUser)

export default router
