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
    async (req: Request, res: Response, next: NextFunction) => {
      const page = parseInt(req.query.page as string)
      const limit = parseInt(req.query.limit as string)

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
