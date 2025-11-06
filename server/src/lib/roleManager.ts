import UserRole, { Role } from '../models/UserRole'
import Log from '../models/Log'

/**
 * Check if a user has a specific role
 */
export const hasRole = async (userId: string, role: Role): Promise<boolean> => {
  try {
    const userRole = await UserRole.findOne({ userId, role })
    return !!userRole
  } catch (error) {
    return false
  }
}

/**
 * Check if a user has any of the specified roles
 */
export const hasAnyRole = async (userId: string, roles: Role[]): Promise<boolean> => {
  try {
    const userRole = await UserRole.findOne({ userId, role: { $in: roles } })
    return !!userRole
  } catch (error) {
    return false
  }
}

/**
 * Get all roles for a user
 */
export const getUserRoles = async (userId: string): Promise<Role[]> => {
  try {
    const userRoles = await UserRole.find({ userId }).select('role')
    return userRoles.map(ur => ur.role)
  } catch (error) {
    return []
  }
}

/**
 * Get the highest role for a user (for display purposes)
 * Priority: super_admin > moderator > user
 */
export const getHighestRole = async (userId: string): Promise<Role> => {
  const roles = await getUserRoles(userId)
  
  if (roles.includes('super_admin')) return 'super_admin'
  if (roles.includes('moderator')) return 'moderator'
  return 'user'
}

/**
 * Assign a role to a user (only super_admins can assign roles)
 */
export const assignRole = async (
  userId: string, 
  role: Role, 
  assignedBy: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if assigner has super_admin role
    const hasPermission = await hasRole(assignedBy, 'super_admin')
    if (!hasPermission) {
      return { success: false, message: 'Only super admins can assign roles' }
    }

    // Check if role already exists
    const existingRole = await UserRole.findOne({ userId, role })
    if (existingRole) {
      return { success: false, message: 'User already has this role' }
    }

    // Create new role
    await UserRole.create({
      userId,
      role,
      assignedBy,
      assignedAt: new Date()
    })

    // Log the action
    await Log.create({
      level: 'security',
      action: 'role_assigned',
      details: `Role ${role} assigned to user ${userId} by ${assignedBy}`,
      userId: assignedBy,
      metadata: { targetUserId: userId, role }
    })

    return { success: true, message: 'Role assigned successfully' }
  } catch (error) {
    return { success: false, message: 'Failed to assign role' }
  }
}

/**
 * Remove a role from a user (only super_admins can remove roles)
 */
export const removeRole = async (
  userId: string, 
  role: Role, 
  removedBy: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if remover has super_admin role
    const hasPermission = await hasRole(removedBy, 'super_admin')
    if (!hasPermission) {
      return { success: false, message: 'Only super admins can remove roles' }
    }

    // Don't allow removing the last super_admin
    if (role === 'super_admin') {
      const superAdminCount = await UserRole.countDocuments({ role: 'super_admin' })
      if (superAdminCount <= 1) {
        return { success: false, message: 'Cannot remove the last super admin' }
      }
    }

    // Remove the role
    const result = await UserRole.deleteOne({ userId, role })
    if (result.deletedCount === 0) {
      return { success: false, message: 'User does not have this role' }
    }

    // Log the action
    await Log.create({
      level: 'security',
      action: 'role_removed',
      details: `Role ${role} removed from user ${userId} by ${removedBy}`,
      userId: removedBy,
      metadata: { targetUserId: userId, role }
    })

    return { success: true, message: 'Role removed successfully' }
  } catch (error) {
    return { success: false, message: 'Failed to remove role' }
  }
}
