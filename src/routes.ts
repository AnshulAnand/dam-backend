import { Express, Request, Response } from 'express'
import {
  createArticleHandler,
  deleteArticleHandler,
  getArticleHandler,
  updateArticleHandler
} from './controller/article.controller'
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler
} from './controller/session.controller'
import { createUserHandler } from './controller/user.controller'
import requireUser from './middleware/requireUser'
import validateResource from './middleware/validateResource'
import {
  createArticleSchema,
  deleteArticleSchema,
  getArticleSchema,
  updateArticleSchema
} from './schema/article.schema'
import { createSessionSchema } from './schema/session.schema'
import { createUserSchema } from './schema/user.schema'

function routes(app: Express) {
  app.get('/health-check', (req: Request, res: Response) => {
    res.sendStatus(200)
  })

  app.post('/users', validateResource(createUserSchema), createUserHandler)

  app.post(
    '/sessions',
    validateResource(createSessionSchema),
    createUserSessionHandler
  )

  app.get('/sessions', requireUser, getUserSessionsHandler)

  app.delete('/sessions', requireUser, deleteSessionHandler)

  app.post(
    '/articles',
    [requireUser, validateResource(createArticleSchema)],
    createArticleHandler
  )

  app.put(
    '/articles/:articleId',
    [requireUser, validateResource(updateArticleSchema)],
    updateArticleHandler
  )

  app.get(
    '/articles/:articleId',
    [requireUser, validateResource(getArticleSchema)],
    getArticleHandler
  )

  app.delete(
    '/articles/:articleId',
    [requireUser, validateResource(deleteArticleSchema)],
    deleteArticleHandler
  )
}

export default routes
