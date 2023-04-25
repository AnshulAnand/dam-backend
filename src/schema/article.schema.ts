import { object, string, TypeOf } from 'zod'

export const createArticleSchema = object({
  body: object({
    title: string({ required_error: 'Title is required' }),
    body: string({ required_error: 'Body is required' }),
    image: string().optional()
  })
})

export const articleSchema = object({
  body: object({
    articleId: string({ required_error: 'Article ID is required' }),
    title: string().optional(),
    url: string({ required_error: 'URL is required ' }),
    body: string().optional(),
    image: string().optional()
  })
})

export type CreateArticleInput = TypeOf<typeof createArticleSchema>
export type ArticleInput = TypeOf<typeof articleSchema>
