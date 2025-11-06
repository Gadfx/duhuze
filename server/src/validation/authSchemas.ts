import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: 'Invalid email address' })
    .max(255, { message: 'Email must be less than 255 characters' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(100, { message: 'Password must be less than 100 characters' })
})

export const registerSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be less than 100 characters' }),
  email: z.string()
    .trim()
    .email({ message: 'Invalid email address' })
    .max(255, { message: 'Email must be less than 255 characters' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(100, { message: 'Password must be less than 100 characters' }),
  age: z.number()
    .int()
    .min(13, { message: 'Must be at least 13 years old' })
    .max(120, { message: 'Invalid age' })
    .optional(),
  sex: z.enum(['boy', 'girl', 'other']).optional(),
  sexOther: z.string()
    .trim()
    .max(50, { message: 'Must be less than 50 characters' })
    .optional()
})

export const userIdParamSchema = z.object({
  userId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid user ID format' })
})

export const banUserSchema = z.object({
  reason: z.string()
    .trim()
    .min(1, { message: 'Reason is required' })
    .max(500, { message: 'Reason must be less than 500 characters' }),
  duration: z.number()
    .int()
    .positive()
    .optional()
})

export const muteUserSchema = z.object({
  duration: z.number()
    .int()
    .positive({ message: 'Duration must be a positive number' })
    .optional()
})

export const kickUserSchema = z.object({
  reason: z.string()
    .trim()
    .max(500, { message: 'Reason must be less than 500 characters' })
    .optional()
})

export const adIdParamSchema = z.object({
  adId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ad ID format' })
})

export const reportIdParamSchema = z.object({
  reportId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid report ID format' })
})
