import express from 'express'
import { authenticateToken, requireSuperAdmin } from '../middlewares/auth'
import { assignRole, removeRole, getUserRoles } from '../lib/roleManager'
import { z } from 'zod'

const router = express.Router()

interface AuthRequest extends express.Request {
  user?: any
}

// Schema for role assignment
const assignRoleSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['user', 'moderator', 'super_admin'])
})

// Schema for role removal
const removeRoleSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['user', 'moderator', 'super_admin'])
})

// Get roles for a user (super admin only)
router.get('/user/:userId', authenticateToken, requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params
    const roles = await getUserRoles(userId)
    res.json({ userId, roles })
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user roles' })
  }
})

// Assign role to user (super admin only)
router.post('/assign', authenticateToken, requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const validation = assignRoleSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({ message: validation.error.errors[0].message })
    }

    const { userId, role } = validation.data
    const result = await assignRole(userId, role, req.user._id.toString())
    
    if (!result.success) {
      return res.status(400).json({ message: result.message })
    }

    res.json({ message: result.message })
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign role' })
  }
})

// Remove role from user (super admin only)
router.post('/remove', authenticateToken, requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const validation = removeRoleSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({ message: validation.error.errors[0].message })
    }

    const { userId, role } = validation.data
    const result = await removeRole(userId, role, req.user._id.toString())
    
    if (!result.success) {
      return res.status(400).json({ message: result.message })
    }

    res.json({ message: result.message })
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove role' })
  }
})

export default router
