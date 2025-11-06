import mongoose, { Document, Schema } from 'mongoose'

export type Role = 'user' | 'moderator' | 'super_admin'

export interface IUserRole extends Document {
  _id: string
  userId: string
  role: Role
  assignedBy?: string
  assignedAt: Date
  createdAt: Date
  updatedAt: Date
}

const userRoleSchema = new Schema<IUserRole>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'super_admin'],
    required: true
  },
  assignedBy: {
    type: String,
    ref: 'User'
  },
  assignedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Compound index to ensure user can only have one instance of each role
userRoleSchema.index({ userId: 1, role: 1 }, { unique: true })

// Index for efficient role lookups
userRoleSchema.index({ userId: 1 })

export default mongoose.model<IUserRole>('UserRole', userRoleSchema)
