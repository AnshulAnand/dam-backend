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

      const results = await model
        .find()
        .sort({ _id: -1 })
        .limit(limit)
        .skip(startIndex)
        .exec()

      res.paginatedResults = results
      next()
    }
  )
}

export default paginatedResults
