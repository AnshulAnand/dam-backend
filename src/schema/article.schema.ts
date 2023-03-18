import { object, number, string, TypeOf } from 'zod'

const payload = {
  body: object({
    title: string({
      required_error: 'Title is required'
    }),
    url: string({
      required_error: 'URL is required'
    }),
    body: string({
      required_error: 'Body is required'
    }),
    image: string({
      required_error: 'Image is required'
    })
  })
}

// articleId and url are same
const params = {
  params: object({
    articleId: string({
      required_error: 'articleId is required'
    })
  })
}

export const createArticleSchema = object({
  ...payload
})

export const updateArticleSchema = object({
  ...payload,
  ...params
})

export const deleteArticleSchema = object({
  ...params
})

export const getArticleSchema = object({
  ...params
})

export type CreateArticleInput = TypeOf<typeof createArticleSchema>
export type UpdateArticleInput = TypeOf<typeof updateArticleSchema>
export type ReadArticleInput = TypeOf<typeof getArticleSchema>
export type DeleteArticleInput = TypeOf<typeof deleteArticleSchema>
