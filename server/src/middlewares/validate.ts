import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'

export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        return res.status(400).json({
          message: 'Validation failed',
          errors: errorMessages
        })
      }
      next(error)
    }
  }
}

export const validateBody = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        return res.status(400).json({
          message: 'Validation failed',
          errors: errorMessages
        })
      }
      next(error)
    }
  }
}

export const validateParams = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = await schema.parseAsync(req.params)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        return res.status(400).json({
          message: 'Validation failed',
          errors: errorMessages
        })
      }
      next(error)
    }
  }
}
