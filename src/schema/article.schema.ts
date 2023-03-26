import { object, string, TypeOf } from 'zod'

export const createArticleSchema = object({
  body: object({
    user: string({ required_error: 'User required' }),
    title: string({ required_error: 'Title is required' }),
    body: string({ required_error: 'Body is required' }),
    images: string().optional()
  })
})

export const articleSchema = object({
  body: object({
    user: string({ required_error: 'User required' }),
    title: string({ required_error: 'Title is required' }),
    url: string({ required_error: 'URL is required ' }),
    body: string({ required_error: 'Body is required' }),
    images: string().optional()
  })
})

export type CreateArticleInput = TypeOf<typeof createArticleSchema>
export type ArticleInput = TypeOf<typeof articleSchema>
