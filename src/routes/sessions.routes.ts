import express from 'express'
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler
} from '../controller/session.controller'
import requireUser from '../middleware/requireUser'
import validateResource from '../middleware/validateResource'
import { createSessionSchema } from '../schema/session.schema'

const router = express.Router()

router
  .route('/')
  .post(validateResource(createSessionSchema), createUserSessionHandler)
  .get(requireUser, getUserSessionsHandler)
  .delete(requireUser, deleteSessionHandler)

export default router
