import mongoose from 'mongoose'
import User from '../models/User'
import Report from '../models/Report'
import dotenv from 'dotenv'

dotenv.config()

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tugwemo')
    console.log('Connected to MongoDB')

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' })
    if (existingSuperAdmin) {
      console.log('Super admin already exists:', existingSuperAdmin.email)
      return
    }

    // Create super admin
    const superAdmin = new User({
      name: 'Super Admin',
      email: 'gadyishimwe1@gmail.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'super_admin'
    })

    await superAdmin.save()
    console.log('Super admin created successfully!')
    console.log('Email: gadyishimwe1@gmail.com')
    console.log('Password: admin123')

    // Create moderator
    const moderator = new User({
      name: 'Moderator',
      email: 'mod@tugwemo.com',
      password: 'mod123',
      role: 'moderator'
    })

    await moderator.save()
    console.log('Moderator created successfully!')
    console.log('Email: mod@tugwemo.com')
    console.log('Password: mod123')

    // Create test users for reports
    const user1 = new User({
      name: 'Test User 1',
      email: 'user1@test.com',
      password: 'user123',
      role: 'user'
    })

    const user2 = new User({
      name: 'Test User 2',
      email: 'user2@test.com',
      password: 'user123',
      role: 'user'
    })

    await user1.save()
    await user2.save()
    console.log('Test users created successfully!')

    // Create test reports
    const reports = [
      {
        reporter: user1._id,
        reportedUser: user2._id,
        reason: 'harassment',
        description: 'Test report for harassment',
        status: 'pending'
      },
      {
        reporter: user2._id,
        reportedUser: user1._id,
        reason: 'spam',
        description: 'Test report for spam',
        status: 'resolved'
      },
      {
        reporter: user1._id,
        reportedUser: user2._id,
        reason: 'inappropriate_content',
        description: 'Inappropriate content reported',
        status: 'pending'
      },
      {
        reporter: user2._id,
        reportedUser: user1._id,
        reason: 'abuse',
        description: 'Abusive behavior reported',
        status: 'dismissed'
      },
      {
        reporter: user1._id,
        reportedUser: user2._id,
        reason: 'other',
        description: 'Other violation reported',
        status: 'pending'
      }
    ]

    for (const reportData of reports) {
      const report = new Report(reportData)
      await report.save()
    }

  } catch (error) {
    console.error('Error seeding admin:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

seedAdmin()
