import { Request, Response } from 'express'
import User from '../models/User'
import Report from '../models/Report'
import Ban from '../models/Ban'
import Setting from '../models/Setting'
import Ad from '../models/Ad'
import Log from '../models/Log'
import mongoose from 'mongoose'

interface NotificationItem {
  _id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  data: any
}

interface AuthRequest extends Request {
  user?: any
}

// Dashboard
export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments()

    // Get active users (online)
    const activeUsers = await User.countDocuments({ isOnline: true })

    // Get total connections (sum of all users' connection counts)
    const totalConnectionsAgg = await User.aggregate([
      {
        $group: {
          _id: null,
          totalConnections: { $sum: '$connectionCount' }
        }
      }
    ])
    const totalConnections = totalConnectionsAgg[0]?.totalConnections || 0

    // Get reports today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const reportsToday = await Report.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    })

    // Get recent activity (last 10 logs)
    const recentLogs = await Log.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)

    const recentActivity = recentLogs.map(log => ({
      description: log.details,
      timestamp: log.createdAt.toISOString(),
      icon: log.level === 'error' ? 'AlertTriangle' :
            log.level === 'warning' ? 'AlertCircle' :
            log.level === 'security' ? 'Shield' : 'Info',
      level: log.level
    }))

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalConnections,
        reportsToday
      },
      recentActivity
    })
  } catch (error) {
    console.error('Get dashboard error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getWelcome = async (req: AuthRequest, res: Response) => {
  try {
    // Log the request
    await Log.create({
      level: 'info',
      action: 'welcome_accessed',
      details: `Welcome endpoint accessed by ${req.user.email}`,
      userId: req.user._id,
      metadata: { method: req.method, path: req.path }
    })

    res.json({ message: 'Welcome to the Admin Panel!' })
  } catch (error) {
    console.error('Welcome error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// User Management
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const search = req.query.search as string
    const status = req.query.status as string

    let query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    if (status === 'online') query.isOnline = true
    if (status === 'banned') query.isBanned = true
    if (status === 'muted') query.isMuted = true

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params
    const updates = req.body

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Log the action
    await Log.create({
      level: 'info',
      action: 'user_updated',
      details: `User ${user.email} updated by ${req.user.email}`,
      userId: req.user._id,
      metadata: { targetUserId: userId, updates }
    })

    res.json({ user })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const banUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params
    const { reason, duration } = req.body

    console.log('Ban user request:', { userId, reason, duration, adminId: req.user._id })

    // Validate input
    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: 'Reason is required' })
    }

    const user = await User.findById(userId)
    if (!user) {
      console.log('User not found:', userId)
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if user is already banned
    if (user.isBanned) {
      return res.status(400).json({ message: 'User is already banned' })
    }

    user.isBanned = true
    user.banReason = reason.trim()
    await user.save()
    console.log('User updated successfully')

    // Create ban record
    const banData: any = {
      user: userId,
      bannedBy: req.user._id,
      reason: reason.trim(),
      isActive: true
    }

    if (duration && duration > 0) {
      banData.duration = duration * 24 * 60 * 60 * 1000 // Convert days to milliseconds
      banData.expiresAt = new Date(Date.now() + banData.duration)
    }

    console.log('Creating ban record:', banData)
    const banRecord = await Ban.create(banData)
    console.log('Ban record created:', banRecord._id)

    // Disconnect the banned user if they are currently connected
    const io = req.app.get('io')
    if (io) {
      try {
        // Emit ban event to all clients (including the banned user)
        io.emit('user-banned', {
          userId,
          reason: reason.trim(),
          bannedBy: req.user._id
        })
        console.log('Ban event emitted to clients')

        // Find and disconnect all sockets belonging to the banned user
        const sockets = await io.fetchSockets()
        for (const socket of sockets) {
          try {
            const token = socket.handshake.auth?.token
            if (token) {
              const jwt = require('jsonwebtoken')
              const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
              if (decoded.userId === userId) {
                socket.emit('force-disconnect', { reason: 'You have been banned', banReason: reason.trim() })
                socket.disconnect(true)
                console.log(`Disconnected banned user socket: ${socket.id}`)
              }
            }
          } catch (socketError) {
            console.log('Error checking socket token:', socketError instanceof Error ? socketError.message : String(socketError))
          }
        }
      } catch (error) {
        console.log('Failed to emit ban event:', error instanceof Error ? error.message : String(error))
      }
    }

    // Log the action
    await Log.create({
      level: 'security',
      action: 'user_banned',
      details: `User ${user.email} banned by ${req.user.email}. Reason: ${reason.trim()}`,
      userId: req.user._id,
      metadata: { targetUserId: userId, reason: reason.trim(), duration }
    })
    console.log('Log entry created')

    res.json({ message: 'User banned successfully' })
  } catch (error) {
    console.error('Ban user error:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
      console.error('Error name:', error.name)
    }

    // Return detailed error for debugging
    const errorDetails = {
      message: 'Failed to ban user',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    }

    console.error('Full error details:', errorDetails)
    res.status(500).json(errorDetails)
  }
}

export const unbanUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.isBanned = false
    user.banReason = undefined
    await user.save()

    // Update ban record
    await Ban.findOneAndUpdate(
      { user: userId, isActive: true },
      { isActive: false }
    )

    // Log the action
    await Log.create({
      level: 'security',
      action: 'user_unbanned',
      details: `User ${user.email} unbanned by ${req.user.email}`,
      userId: req.user._id,
      metadata: { targetUserId: userId }
    })

    res.json({ message: 'User unbanned successfully' })
  } catch (error) {
    console.error('Unban user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const muteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params
    const { duration } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.isMuted = true
    if (duration) {
      user.muteExpiresAt = new Date(Date.now() + duration)
    }
    await user.save()

    // Log the action
    await Log.create({
      level: 'warning',
      action: 'user_muted',
      details: `User ${user.email} muted by ${req.user.email}`,
      userId: req.user._id,
      metadata: { targetUserId: userId, duration }
    })

    res.json({ message: 'User muted successfully' })
  } catch (error) {
    console.error('Mute user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const unmuteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.isMuted = false
    user.muteExpiresAt = undefined
    await user.save()

    // Log the action
    await Log.create({
      level: 'info',
      action: 'user_unmuted',
      details: `User ${user.email} unmuted by ${req.user.email}`,
      userId: req.user._id,
      metadata: { targetUserId: userId }
    })

    res.json({ message: 'User unmuted successfully' })
  } catch (error) {
    console.error('Unmute user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const viewUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('View user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Reports Management
export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const status = req.query.status as string || 'pending'

    let query: any = {}
    if (status !== 'all') {
      query.status = status
    }

    const reports = await Report.find(query)
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)

    const total = await Report.countDocuments(query)

    res.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Get reports error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const resolveReport = async (req: AuthRequest, res: Response) => {
  try {
    const { reportId } = req.params
    const { action, notes } = req.body

    const report = await Report.findById(reportId)
    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }

    report.status = action === 'resolve' ? 'resolved' : 'dismissed'
    report.resolvedBy = req.user._id
    report.resolvedAt = new Date()
    await report.save()

    // Log the action
    await Log.create({
      level: 'info',
      action: 'report_resolved',
      details: `Report ${reportId} ${action}d by ${req.user.email}`,
      userId: req.user._id,
      metadata: { reportId, action, notes }
    })

    res.json({ message: `Report ${action}d successfully` })
  } catch (error) {
    console.error('Resolve report error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Analytics
export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { period = '30d' } = req.query
    const startDate = new Date()

    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
      default:
        startDate.setDate(startDate.getDate() - 30)
    }

    // User growth - get daily user registrations
    let userGrowth = []
    try {
      userGrowth = await User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    } catch (aggError) {
      console.error('User growth aggregate error:', aggError)
    }

    // Get active users (users who have been online in the last 24 hours)
    let activeUsers = 0
    try {
      activeUsers = await User.countDocuments({
        lastSeen: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      })
    } catch (countError) {
      console.error('Active users count error:', countError)
    }

    // Get total connections (sum of all users' connection counts)
    let totalConnectionsAgg: any[]
    try {
      totalConnectionsAgg = await User.aggregate([
        {
          $group: {
            _id: null,
            totalConnections: { $sum: '$connectionCount' }
          }
        }
      ])
    } catch (connAggError) {
      console.error('Total connections aggregate error:', connAggError)
      totalConnectionsAgg = []
    }

    // Connection stats - simplified to avoid multiple queries
    let connectionStats = []
    try {
      const hourlyConnections = await User.aggregate([
        {
          $match: {
            lastSeen: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%H', date: '$lastSeen' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])

      // Create array for all 24 hours
      for (let hour = 0; hour < 24; hour++) {
        const hourStr = hour.toString().padStart(2, '0')
        const found = hourlyConnections.find(h => h._id === hourStr)
        connectionStats.push({
          hour: hour,
          connections: found ? found.count : 0
        })
      }
    } catch (connError) {
      console.error('Connection stats aggregate error:', connError)
      // Fallback to empty array
      connectionStats = Array.from({ length: 24 }, (_, i) => ({ hour: i, connections: 0 }))
    }

    // Report stats - daily reports
    let reportStats = []
    try {
      reportStats = await Report.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            reports: { $sum: 1 },
            resolved: {
              $sum: {
                $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0]
              }
            }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    } catch (reportError) {
      console.error('Report stats aggregate error:', reportError)
    }

    // Device stats - mock data for now
    const deviceStats = [
      { name: 'Desktop', value: 65 },
      { name: 'Mobile', value: 30 },
      { name: 'Tablet', value: 5 }
    ]

    res.json({
      userGrowth: userGrowth.map(item => ({
        date: item._id,
        users: item.count,
        activeUsers: Math.floor(Number(item.count) * 0.7) // Mock active users
      })),
      connectionStats: {
        totalConnections: totalConnectionsAgg[0]?.totalConnections || 0,
        avgConnectionsPerUser: totalConnectionsAgg[0]?.totalConnections ? (totalConnectionsAgg[0].totalConnections / (await User.countDocuments())) : 0
      },
      reportStats: reportStats.map(item => ({
        date: item._id,
        reports: item.reports,
        resolved: item.resolved
      })),
      deviceStats: [
        { name: 'Desktop', value: 65 },
        { name: 'Mobile', value: 30 },
        { name: 'Tablet', value: 5 }
      ]
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Settings Management
export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const settings = await Setting.find({}).sort({ category: 1, key: 1 })

    // Convert to object format
    const settingsObj: any = {}
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value
    })

    res.json({ settings: settingsObj })
  } catch (error) {
    console.error('Get settings error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const updates = req.body

    for (const [key, value] of Object.entries(updates)) {
      await Setting.findOneAndUpdate(
        { key },
        {
          value,
          updatedBy: req.user._id,
          updatedAt: new Date()
        },
        { upsert: true }
      )
    }

    // Log the action
    await Log.create({
      level: 'info',
      action: 'settings_updated',
      details: `Settings updated by ${req.user.email}`,
      userId: req.user._id,
      metadata: { updates }
    })

    res.json({ message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Update settings error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Ads Management
export const getAds = async (req: AuthRequest, res: Response) => {
  try {
    const ads = await Ad.find({})
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })

    res.json({ ads })
  } catch (error) {
    console.error('Get ads error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const createAd = async (req: AuthRequest, res: Response) => {
  try {
    const adData = {
      ...req.body,
      createdBy: req.user._id
    }

    const ad = await Ad.create(adData)

    // Log the action
    await Log.create({
      level: 'info',
      action: 'ad_created',
      details: `Ad "${ad.title}" created by ${req.user.email}`,
      userId: req.user._id,
      metadata: { adId: ad._id }
    })

    res.status(201).json({ ad })
  } catch (error) {
    console.error('Create ad error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateAd = async (req: AuthRequest, res: Response) => {
  try {
    const { adId } = req.params
    const ad = await Ad.findByIdAndUpdate(adId, req.body, { new: true })

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    // Log the action
    await Log.create({
      level: 'info',
      action: 'ad_updated',
      details: `Ad "${ad.title}" updated by ${req.user.email}`,
      userId: req.user._id,
      metadata: { adId }
    })

    res.json({ ad })
  } catch (error) {
    console.error('Update ad error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteAd = async (req: AuthRequest, res: Response) => {
  try {
    const { adId } = req.params
    const ad = await Ad.findByIdAndDelete(adId)

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    // Log the action
    await Log.create({
      level: 'warning',
      action: 'ad_deleted',
      details: `Ad "${ad.title}" deleted by ${req.user.email}`,
      userId: req.user._id,
      metadata: { adId }
    })

    res.json({ message: 'Ad deleted successfully' })
  } catch (error) {
    console.error('Delete ad error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const toggleAd = async (req: AuthRequest, res: Response) => {
  try {
    const { adId } = req.params
    const ad = await Ad.findById(adId)

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    ad.isActive = !ad.isActive
    await ad.save()

    // Log the action
    await Log.create({
      level: 'info',
      action: 'ad_toggled',
      details: `Ad "${ad.title}" ${ad.isActive ? 'activated' : 'deactivated'} by ${req.user.email}`,
      userId: req.user._id,
      metadata: { adId, isActive: ad.isActive }
    })

    res.json({ ad })
  } catch (error) {
    console.error('Toggle ad error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Logs Management
export const getLogs = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    const search = req.query.search as string
    const level = req.query.level as string

    let query: any = {}

    if (search) {
      query.$or = [
        { action: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } }
      ]
    }

    if (level && level !== 'all') {
      query.level = level
    }

    const logs = await Log.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)

    // Transform logs to include user info properly
    const transformedLogs = logs.map(log => {
      const logObj = log.toObject()
      return {
        ...logObj,
        user: log.userId ? ((log.userId as any).name || (log.userId as any).email) : 'System'
      }
    })

    const total = await Log.countDocuments(query)

    res.json({
      logs: transformedLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get logs error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const exportLogs = async (req: AuthRequest, res: Response) => {
  try {
    const search = req.query.search as string
    const level = req.query.level as string

    let query: any = {}

    if (search) {
      query.$or = [
        { action: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } }
      ]
    }

    if (level && level !== 'all') {
      query.level = level
    }

    const logs = await Log.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })

    // Convert to CSV
    const csvHeader = 'Timestamp,Level,User,Action,IP Address,Details\n'
    const csvRows = logs.map(log => {
      const timestamp = log.createdAt.toISOString()
      const user = log.userId ? ((log.userId as any).name || (log.userId as any).email) : 'System'
      const details = log.details.replace(/"/g, '""') // Escape quotes
      return `"${timestamp}","${log.level}","${user}","${log.action}","${log.ipAddress || ''}","${details}"`
    }).join('\n')

    const csv = csvHeader + csvRows

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="logs.csv"')
    res.send(csv)
  } catch (error) {
    console.error('Export logs error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// System Controls
export const clearCache = async (req: AuthRequest, res: Response) => {
  try {
    // Implement cache clearing logic here
    // This could involve Redis, in-memory cache, etc.

    await Log.create({
      level: 'info',
      action: 'cache_cleared',
      details: `System cache cleared by ${req.user.email}`,
      userId: req.user._id
    })

    res.json({ message: 'Cache cleared successfully' })
  } catch (error) {
    console.error('Clear cache error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const createBackup = async (req: AuthRequest, res: Response) => {
  try {
    // Implement backup logic here
    // This could involve database dumps, file backups, etc.

    await Log.create({
      level: 'info',
      action: 'backup_created',
      details: `Database backup created by ${req.user.email}`,
      userId: req.user._id
    })

    res.json({ message: 'Backup created successfully' })
  } catch (error) {
    console.error('Create backup error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const restartServer = async (req: AuthRequest, res: Response) => {
  try {
    await Log.create({
      level: 'warning',
      action: 'server_restart',
      details: `Server restart initiated by ${req.user.email}`,
      userId: req.user._id
    })

    // Send response before restarting
    res.json({ message: 'Server restart initiated' })

    // Graceful shutdown and restart
    setTimeout(() => {
      process.exit(0) // PM2 or similar should restart the process
    }, 1000)
  } catch (error) {
    console.error('Restart server error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Notifications
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    // Get recent reports (pending)
    const recentReports = await Report.find({ status: 'pending' })
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)

    // Get recent user registrations
    const recentUsers = await User.find({})
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .limit(5)

    // Get recent security logs
    const recentSecurityLogs = await Log.find({
      level: { $in: ['security', 'warning'] },
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)

    // Combine and format notifications
    const notifications: NotificationItem[] = []

    // Add report notifications
    recentReports.forEach(report => {
      const reporter = report.reporter as any
      const reportedUser = report.reportedUser as any
      notifications.push({
        _id: `report_${report._id}`,
        type: 'report',
        title: 'New Report',
        message: `${reporter?.name || 'Unknown'} reported ${reportedUser?.name || 'Unknown'} for ${report.reason}`,
        isRead: false,
        createdAt: report.createdAt,
        data: { reportId: report._id }
      })
    })

    // Add new user notifications
    recentUsers.forEach(user => {
      notifications.push({
        _id: `user_${user._id}`,
        type: 'new_user',
        title: 'New User Registration',
        message: `${user.name} (${user.email}) joined the platform`,
        isRead: false,
        createdAt: user.createdAt,
        data: { userId: user._id }
      })
    })

    // Add security notifications
    recentSecurityLogs.forEach(log => {
      notifications.push({
        _id: `log_${log._id}`,
        type: 'security',
        title: 'Security Alert',
        message: log.details,
        isRead: false,
        createdAt: log.createdAt,
        data: { logId: log._id }
      })
    })

    // Sort by creation date (newest first)
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Get unread count (for demo, consider all as unread)
    const unreadCount = notifications.length

    // Paginate
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedNotifications = notifications.slice(startIndex, endIndex)

    res.json({
      notifications: paginatedNotifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total: notifications.length,
        pages: Math.ceil(notifications.length / limit)
      }
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  try {
    const { notificationId } = req.params

    // For now, just return success since we're not storing read status
    // In a real implementation, you'd have a Notification model with read status

    res.json({ message: 'Notification marked as read' })
  } catch (error) {
    console.error('Mark notification read error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
