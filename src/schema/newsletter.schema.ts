import { object, string, TypeOf } from 'zod'

export const newsletterSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' })
  })
})

export type NewsletterSchema = TypeOf<typeof newsletterSchema>
