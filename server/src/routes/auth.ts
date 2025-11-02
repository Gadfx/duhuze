import express from 'express'
import { login, register, userLogin, getProfile } from '../controllers/authController'
import { authenticateToken } from '../middlewares/auth'
import Ad from '../models/Ad'

const router = express.Router()

// Admin login route
router.post('/login', login)

// User registration
router.post('/register', register)

// User login
router.post('/user/login', userLogin)

// Get current user profile (protected)
router.get('/profile', authenticateToken, getProfile)

// Public ads endpoint for clients
router.get('/ads', async (req, res) => {
  try {
    const now = new Date()
    const ads = await Ad.find({
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: { $lte: now } },
            { startDate: null }
          ]
        },
        {
          $or: [
            { endDate: { $gte: now } },
            { endDate: null }
          ]
        }
      ]
    }).sort({ createdAt: -1 })

    // Track impressions for each ad
    for (const ad of ads) {
      ad.impressions += 1
      await ad.save()
    }

    res.json({ ads })
  } catch (error) {
    console.error('Get ads error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Track ad clicks
router.post('/ads/:adId/click', async (req, res) => {
  try {
    const { adId } = req.params
    const ad = await Ad.findById(adId)

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    ad.clicks += 1
    await ad.save()

    res.json({ message: 'Click tracked' })
  } catch (error) {
    console.error('Track ad click error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
