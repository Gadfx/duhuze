import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import { hasAnyRole, getHighestRole, Role } from '../lib/roleManager'

interface AuthRequest extends Request {
  user?: any
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Access token required' })
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set')
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    if (user.isBanned) {
      return res.status(403).json({ message: `${user.name} you have been banned for ${user.banReason || 'unspecified reason'}` })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}

export const requireRole = (roles: Role[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    try {
      const hasPermission = await hasAnyRole(req.user._id.toString(), roles)
      if (!hasPermission) {
        return res.status(403).json({ message: 'Insufficient permissions' })
      }
      next()
    } catch (error) {
      return res.status(500).json({ message: 'Authorization check failed' })
    }
  }
}

export const requireSuperAdmin = requireRole(['super_admin'])
export const requireModerator = requireRole(['moderator', 'super_admin'])
