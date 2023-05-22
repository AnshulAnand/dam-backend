import { object, string, TypeOf } from 'zod'

export const createPostSchema = object({
  body: object({
    title: string({ required_error: 'Title is required' }),
    description: string({ required_error: 'Description is required' }),
    body: string({ required_error: 'Body is required' }),
    image: string().optional()
  })
})

export const postSchema = object({
  body: object({
    postId: string({ required_error: 'Post ID is required' }),
    title: string().optional(),
    url: string().optional(),
    description: string().optional(),
    body: string().optional(),
    image: string().optional()
  })
})

export type CreatePostInput = TypeOf<typeof createPostSchema>
export type PostInput = TypeOf<typeof postSchema>
