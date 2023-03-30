import { object, string, TypeOf } from 'zod'

export const createCommentSchema = object({
  body: object({
    body: string({ required_error: 'Body is required' })
  })
})

export type CreateCommentInput = TypeOf<typeof createCommentSchema>
