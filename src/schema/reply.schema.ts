import { object, string, TypeOf } from 'zod'

export const createReplySchema = object({
  body: object({
    body: string({ required_error: 'Body is required' }),
    parentCommentId: string({ required_error: 'Parent article is required' })
  })
})

export const updateReplySchema = object({
  body: object({
    body: string({ required_error: 'Body is required' }),
    replyId: string({ required_error: 'Reply Id is required' })
  })
})

export type CreateReplyInput = TypeOf<typeof createReplySchema>
export type UpdateReplyInput = TypeOf<typeof updateReplySchema>
