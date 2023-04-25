import { object, string, TypeOf } from 'zod'

export const createCommentSchema = object({
  body: object({
    body: string({ required_error: 'Body is required' }),
    parentArticleId: string({ required_error: 'Parent article is required' })
  })
})

export const updateCommentSchema = object({
  body: object({
    body: string({ required_error: 'Body is required' }),
    commentId: string({ required_error: 'Comment Id is required' })
  })
})

export type CreateCommentInput = TypeOf<typeof createCommentSchema>
export type UpdateCommentInput = TypeOf<typeof updateCommentSchema>
