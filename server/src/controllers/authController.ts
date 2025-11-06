import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import UserRole from '../models/UserRole'
import { hasAnyRole, getHighestRole, getUserRoles } from '../lib/roleManager'

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({ message: `${user.name} you have been banned for ${user.banReason || 'unspecified reason'}` })
    }

    // Check if user has admin role
    const hasAdminRole = await hasAnyRole(user._id.toString(), ['moderator', 'super_admin'])
    if (!hasAdminRole) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' })
    }

    // Check password
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set')
    }
    
    const role = await getHighestRole(user._id.toString())
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, age, sex, sexOther } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      age,
      sex,
      sexOther
    })

    await user.save()

    // Assign default 'user' role
    await UserRole.create({
      userId: user._id.toString(),
      role: 'user'
    })

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set')
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        sex: user.sex,
        sexOther: user.sexOther,
        role: 'user'
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({ message: `${user.name} you have been banned for ${user.banReason || 'unspecified reason'}` })
    }

    // Check password
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set')
    }
    
    const role = await getHighestRole(user._id.toString())
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    const role = await getHighestRole(user._id.toString())
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
