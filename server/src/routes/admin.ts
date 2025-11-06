import express from 'express'
import {
  getDashboard,
  getWelcome,
  getUsers,
  updateUser,
  banUser,
  unbanUser,
  muteUser,
  unmuteUser,
  viewUser,
  getReports,
  resolveReport,
  getAnalytics,
  getSettings,
  updateSettings,
  getAds,
  createAd,
  updateAd,
  deleteAd,
  toggleAd,
  getLogs,
  exportLogs,
  clearCache,
  createBackup,
  restartServer,
  getNotifications,
  markNotificationRead
} from '../controllers/adminController'
import { authenticateToken, requireModerator, requireSuperAdmin } from '../middlewares/auth'
import { validateParams, validateBody } from '../middlewares/validate'
import { 
  userIdParamSchema, 
  banUserSchema, 
  muteUserSchema, 
  kickUserSchema,
  adIdParamSchema,
  reportIdParamSchema 
} from '../validation/authSchemas'

interface AuthRequest extends express.Request {
  user?: any
}

const router = express.Router()

// Apply authentication to all admin routes
router.use(authenticateToken)

// Dashboard Route
router.get('/dashboard', requireModerator, getDashboard)

// Welcome Route
router.get('/welcome', requireModerator, getWelcome)

// User Management Routes
router.get('/users', requireModerator, getUsers)
router.put('/users/:userId', requireModerator, validateParams(userIdParamSchema), updateUser)
router.post('/users/:userId/ban', requireModerator, validateParams(userIdParamSchema), validateBody(banUserSchema), banUser)
router.post('/users/:userId/unban', requireModerator, validateParams(userIdParamSchema), unbanUser)
router.post('/users/:userId/mute', requireModerator, validateParams(userIdParamSchema), validateBody(muteUserSchema), muteUser)
router.post('/users/:userId/unmute', requireModerator, validateParams(userIdParamSchema), unmuteUser)
router.get('/users/:userId', requireModerator, validateParams(userIdParamSchema), viewUser)
router.post('/users/:userId/kick', requireModerator, validateParams(userIdParamSchema), validateBody(kickUserSchema), async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params
    const { reason } = req.body

    // Import required modules
    const User = require('../models/User').default
    const Log = require('../models/Log').default

    // Find user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Get io instance from app
    const io = req.app.get('io')
    if (!io) {
      return res.status(500).json({ message: 'Socket server not available' })
    }

    // Emit kick event to all clients (main namespace)
    io.emit('user-kicked', {
      userId,
      reason: reason || 'Kicked by admin',
      kickedBy: req.user._id
    })

    // Log the action
    await Log.create({
      level: 'warning',
      action: 'user_kicked',
      details: `User ${user.email} kicked by ${req.user.email}. Reason: ${reason || 'No reason provided'}`,
      userId: req.user._id,
      metadata: { targetUserId: userId, reason }
    })

    res.json({ message: 'User kicked successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to kick user' })
  }
})

// Reports Management Routes
router.get('/reports', requireModerator, getReports)
router.post('/reports/:reportId/resolve', requireModerator, validateParams(reportIdParamSchema), resolveReport)

// Analytics Routes
router.get('/analytics', requireModerator, getAnalytics)

// Settings Routes
router.get('/settings', requireModerator, getSettings)
router.put('/settings', requireSuperAdmin, updateSettings)

// Ads Management Routes
router.get('/ads', requireModerator, getAds)
router.post('/ads', requireModerator, createAd)
router.put('/ads/:adId', requireModerator, validateParams(adIdParamSchema), updateAd)
router.delete('/ads/:adId', requireModerator, validateParams(adIdParamSchema), deleteAd)
router.patch('/ads/:adId/toggle', requireModerator, validateParams(adIdParamSchema), toggleAd)
router.post('/upload-ad-image', requireModerator, async (req: AuthRequest, res) => {
  try {
    const multer = require('multer')
    const path = require('path')
    const fs = require('fs')

    // Configure multer for image upload
    const storage = multer.diskStorage({
      destination: (req: any, file: any, cb: any) => {
        const uploadDir = path.join(__dirname, '../../uploads/ads')
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }
        cb(null, uploadDir)
      },
      filename: (req: any, file: any, cb: any) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'ad-' + uniqueSuffix + path.extname(file.originalname))
      }
    })

    const upload = multer({
      storage: storage,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true)
        } else {
          cb(new Error('Only image files are allowed!'), false)
        }
      }
    }).single('image')

    upload(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ message: err.message })
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
      }

      // Return the image URL
      const imageUrl = `/uploads/ads/${req.file.filename}`
      res.json({ imageUrl })
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload image' })
  }
})

// Logs Routes
router.get('/logs', requireModerator, getLogs)
router.get('/logs/export', requireModerator, exportLogs)

// System Control Routes (Super Admin only)
router.post('/system/clear-cache', requireSuperAdmin, clearCache)
router.post('/system/backup', requireSuperAdmin, createBackup)
router.post('/system/restart', requireSuperAdmin, restartServer)

// Notifications Routes
router.get('/notifications', requireModerator, getNotifications)
router.patch('/notifications/:notificationId/read', requireModerator, markNotificationRead)

export default router
