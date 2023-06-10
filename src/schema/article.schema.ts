import { array, object, string, TypeOf } from 'zod'

export const createArticleSchema = object({
  body: object({
    title: string({ required_error: 'Title is required' }),
    tags: array(string()).optional(),
    description: string().optional(),
    body: string({ required_error: 'Body is required' }),
    image: string().optional()
  })
})

export const updateArticleSchema = object({
  body: object({
    articleId: string({ required_error: 'Article ID is required' }),
    title: string().optional(),
    url: string().optional(),
    tags: array(string()).optional(),
    description: string().optional(),
    body: string().optional(),
    image: string().optional()
  })
})

export const searchArticleSchema = object({
  query: object({
    page: string({ required_error: 'Page number is required' }),
    limit: string({ required_error: 'Limit number is required' }),
    category: string({ required_error: 'Category is required' }),
    body: string({ required_error: 'Body is required' })
  })
})

export type CreateArticleInput = TypeOf<typeof createArticleSchema>
export type UpdateArticleInput = TypeOf<typeof updateArticleSchema>
export type SearchArticleInput = TypeOf<typeof searchArticleSchema>
