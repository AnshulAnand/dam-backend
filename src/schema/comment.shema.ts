import { object, string, TypeOf } from 'zod'

export const createCommentSchema = object({
  body: object({
    user: string({ required_error: 'User required' }),
    body: string({ required_error: 'Body is required' })
  })
})

export type CreateCommentInput = TypeOf<typeof createCommentSchema>
