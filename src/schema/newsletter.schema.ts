import { object, string, TypeOf } from 'zod'

export const subNewsletterSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' })
  })
})

export const unsubNewsletterSchema = object({
  body: object({
    id: string({ required_error: 'Code is required' })
  })
})

export type SubNewsletterSchema = TypeOf<typeof subNewsletterSchema>
export type UnsubNewsletterSchema = TypeOf<typeof unsubNewsletterSchema>
