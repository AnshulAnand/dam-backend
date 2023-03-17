import { Request, Response } from 'express'
import {
  CreateArticleInput,
  DeleteArticleInput,
  ReadArticleInput,
  UpdateArticleInput
} from '../schema/article.schema'
import {
  createArticle,
  deleteArticle,
  findAndUpdateArticle,
  findArticle
} from '../service/article.service'

export async function createArticleHandler(
  req: Request<{}, {}, CreateArticleInput['body']>,
  res: Response
) {
  const userId = res.locals.user._id

  const body = req.body

  const article = await createArticle({ ...body, user: userId })

  return res.send(article)
}

export async function updateArticleHandler(
  req: Request<UpdateArticleInput['params']>,
  res: Response
) {
  const userId = res.locals.user._id

  const articleId = req.params.articleId
  const update = req.body

  const article = await findArticle({ articleId })

  if (!article) return res.sendStatus(404)

  if (String(article.user) !== userId) return res.sendStatus(403)

  const updatedArticle = await findAndUpdateArticle({ articleId }, update, {
    new: true
  })

  return res.send(updatedArticle)
}

export async function getArticleHandler(
  req: Request<ReadArticleInput['params']>,
  res: Response
) {
  const articleId = req.params.articleId
  const article = await findArticle({ articleId })

  if (!article) return res.sendStatus(404)

  return res.send(article)
}

export async function deleteArticleHandler(
  req: Request<DeleteArticleInput['params']>,
  res: Response
) {
  const userId = res.locals.user._id
  const articleId = req.params.articleId

  const article = await findArticle({ articleId })

  if (!article) return res.sendStatus(404)

  if (String(article.user) !== userId) return res.sendStatus(403)

  await deleteArticle({ articleId })

  return res.sendStatus(200)
}
