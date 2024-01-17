import { Request, Response, NextFunction } from 'express'
const asyncHandler = (fn: any) => {
  //cloresure function
  return (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res, next).catch(next)
  }
}

export { asyncHandler }
