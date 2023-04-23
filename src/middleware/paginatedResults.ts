import { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'

declare global {
  namespace Express {
    interface Response {
      paginatedResults: any
    }
  }
}

function paginatedResults(model) {
  return asyncHandler(
    async (
      req: Request<{}, {}, { page: number; limit: number }>,
      res: Response,
      next: NextFunction
    ) => {
      const { page, limit } = req.body
      const startIndex = (page - 1) * limit
      const lastIndex = page * limit

      interface Results {
        next?: { page: number; limit: number }
        previous?: { page: number; limit: number }
        results?: any
      }

      const results: Results = {}

      if (lastIndex < (await model.countDocuments().exec())) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }

      results.results = await model.find().limit(limit).skip(startIndex).exec()

      res.paginatedResults = results
      next()
    }
  )
}

export default paginatedResults
