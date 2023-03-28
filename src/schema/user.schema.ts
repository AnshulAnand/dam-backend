import { object, string, TypeOf } from 'zod'

export const createUserSchema = object({
  body: object({
    name: string({ required_error: 'Name is required' }),
    username: string({ required_error: 'Username is required' }),
    password: string({ required_error: 'Password is required' }).min(
      6,
      'Password too short- should be 6 characters minimum'
    ),
    email: string({ required_error: 'Email is required' }).email(
      'Invalid e-mail'
    ),
    country: string().optional(),
    bio: string().optional(),
    image: string().optional(),
    link: string().optional()
  })
})

export const loginUserSchema = object({
  body: object({
    password: string({ required_error: 'Password is required' }).min(
      6,
      'Password too short- should be 6 characters minimum'
    ),
    email: string({ required_error: 'Email is required' }).email(
      'Invalid e-mail'
    )
  })
})

export const logoutUserSchema = object({
  body: object({
    username: string({ required_error: 'Username is required' })
  })
})

export type CreateUserInput = TypeOf<typeof createUserSchema>
export type LoginUserInput = TypeOf<typeof loginUserSchema>
export type LogoutUserInput = TypeOf<typeof logoutUserSchema>
