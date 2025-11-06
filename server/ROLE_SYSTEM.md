# User Role System Documentation

## Overview

The application now uses a **separate UserRole collection** to store user roles, preventing privilege escalation attacks. Users can have multiple roles simultaneously.

## Architecture

### Models

1. **UserRole** (`server/src/models/UserRole.ts`)
   - Stores role assignments in a dedicated collection
   - Links `userId` to `role` with unique constraint
   - Tracks who assigned the role and when

2. **User** (`server/src/models/User.ts`)
   - No longer contains `role` field
   - Roles are fetched from UserRole collection

### Role Management

**Role Manager** (`server/src/lib/roleManager.ts`) provides secure functions:

- `hasRole(userId, role)` - Check if user has specific role
- `hasAnyRole(userId, roles[])` - Check if user has any of specified roles
- `getUserRoles(userId)` - Get all roles for a user
- `getHighestRole(userId)` - Get highest priority role (for display)
- `assignRole(userId, role, assignedBy)` - Assign role (super_admin only)
- `removeRole(userId, role, removedBy)` - Remove role (super_admin only)

### Security Features

✅ **Prevents Privilege Escalation**: Roles in separate collection, not on user object
✅ **Audit Trail**: Tracks who assigned roles and when
✅ **Access Control**: Only super_admins can assign/remove roles
✅ **Protection**: Cannot remove last super_admin
✅ **Logging**: All role changes logged to security logs

## API Endpoints

### Get User Roles
```http
GET /api/roles/user/:userId
Authorization: Bearer <super_admin_token>
```

### Assign Role
```http
POST /api/roles/assign
Authorization: Bearer <super_admin_token>
Content-Type: application/json

{
  "userId": "user_id_here",
  "role": "moderator"
}
```

### Remove Role
```http
POST /api/roles/remove
Authorization: Bearer <super_admin_token>
Content-Type: application/json

{
  "userId": "user_id_here",
  "role": "moderator"
}
```

## Migration

### Running the Migration

To migrate existing user roles from the old User model to the new UserRole collection:

```bash
npx ts-node server/src/scripts/migrateRoles.ts
```

This script will:
1. Find all users with a `role` field
2. Create corresponding UserRole documents
3. Remove the `role` field from User documents
4. Provide a summary of the migration

**Important**: Run this migration ONCE after deploying the new code.

## Usage in Code

### Checking Roles in Middleware

```typescript
import { requireRole } from '../middlewares/auth'

// Require specific roles
router.get('/admin-only', requireRole(['super_admin']), handler)
router.get('/moderator', requireRole(['moderator', 'super_admin']), handler)
```

### Checking Roles in Controllers

```typescript
import { hasRole, hasAnyRole } from '../lib/roleManager'

// Check single role
const isAdmin = await hasRole(userId, 'super_admin')

// Check multiple roles
const canModerate = await hasAnyRole(userId, ['moderator', 'super_admin'])
```

### Getting User Roles

```typescript
import { getUserRoles, getHighestRole } from '../lib/roleManager'

// Get all roles
const roles = await getUserRoles(userId) // ['user', 'moderator']

// Get primary role for display
const role = await getHighestRole(userId) // 'moderator'
```

## Role Hierarchy

Priority (highest to lowest):
1. **super_admin** - Full system access, can assign/remove roles
2. **moderator** - Can manage users, view reports, moderate content
3. **user** - Standard user access

## Important Notes

1. **Default Role**: New users automatically receive 'user' role
2. **Multiple Roles**: Users can have multiple roles simultaneously
3. **Role Changes**: All role assignments/removals are logged
4. **Last Super Admin**: System prevents removing the last super_admin
5. **JWT Tokens**: Tokens no longer contain role information (fetched on auth)

## Security Best Practices

✅ Always use `roleManager` functions to check roles
✅ Never check roles from client-side data
✅ Log all role changes for audit trail
✅ Protect role assignment endpoints
✅ Regularly review role assignments

## Troubleshooting

**Issue**: Users can't access admin panel after migration
**Solution**: Ensure migration script ran successfully and UserRole documents exist

**Issue**: "Insufficient permissions" errors
**Solution**: Verify user has correct role in UserRole collection

**Issue**: Token still contains old role field
**Solution**: Users need to log out and log back in to get new token format
