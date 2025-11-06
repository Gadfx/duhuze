/**
 * Migration script to move roles from User model to UserRole collection
 * Run this ONCE after deploying the new role system
 * 
 * Usage: npx ts-node server/src/scripts/migrateRoles.ts
 */

import mongoose from 'mongoose'
import UserRole from '../models/UserRole'

interface OldUser {
  _id: any
  email: string
  role?: string
}

async function migrateRoles() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/videochat'
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Get the old User collection directly (before schema was updated)
    const UserCollection = mongoose.connection.collection('users')
    
    // Find all users with a role field
    const usersWithRoles = await UserCollection.find({ role: { $exists: true } }).toArray() as OldUser[]
    
    console.log(`Found ${usersWithRoles.length} users with roles`)

    let migrated = 0
    let skipped = 0
    let errors = 0

    for (const user of usersWithRoles) {
      try {
        const userId = user._id.toString()
        const role = user.role || 'user'

        // Check if role already exists in UserRole collection
        const existingRole = await UserRole.findOne({ userId, role })
        
        if (existingRole) {
          console.log(`Skipping ${user.email} - role already exists`)
          skipped++
          continue
        }

        // Create role in UserRole collection
        await UserRole.create({
          userId,
          role,
          assignedAt: new Date()
        })

        console.log(`Migrated ${user.email} with role: ${role}`)
        migrated++
      } catch (error: any) {
        console.error(`Error migrating ${user.email}:`, error.message)
        errors++
      }
    }

    console.log('\n=== Migration Summary ===')
    console.log(`Total users found: ${usersWithRoles.length}`)
    console.log(`Successfully migrated: ${migrated}`)
    console.log(`Skipped (already exists): ${skipped}`)
    console.log(`Errors: ${errors}`)

    // Optional: Remove role field from User documents
    console.log('\nRemoving role field from User documents...')
    const result = await UserCollection.updateMany(
      { role: { $exists: true } },
      { $unset: { role: "" } }
    )
    console.log(`Updated ${result.modifiedCount} user documents`)

    await mongoose.disconnect()
    console.log('\nMigration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateRoles()
