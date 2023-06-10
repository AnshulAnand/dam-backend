import { object, string, TypeOf } from 'zod'

export const newsletterSchema = object({
  body: object({
    user: string({ required_error: 'User is required' })
  })
})

export type NewsletterSchema = TypeOf<typeof newsletterSchema>
