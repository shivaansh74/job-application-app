const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for:', username);

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', {
      username: user.username,
      userType: user.userType,
      hasPassword: !!user.password
    });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password does not match for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        userType: user.userType,
        username: user.username
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', username);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Create new user (super admin only)
router.post('/create-user', async (req, res) => {
  try {
    console.log('Create user request received:', {
      username: req.body.username,
      // Don't log the actual password
      hasPassword: !!req.body.password
    });
    
    const { username, password } = req.body;
    
    // Get the token from the header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authorization required' });
    }

    // Verify token and check if user is super admin
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.userType !== 1) {
      return res.status(403).json({ message: 'Super admin access required' });
    }

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new regular user with explicit password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      userType: 2 // Regular user
    });

    await newUser.save();
    
    console.log('New user created successfully:', {
      username: newUser.username,
      userType: newUser.userType,
      hashedPassword: !!newUser.password
    });
    
    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        userType: newUser.userType
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Get all users (super admin only)
router.get('/users', async (req, res) => {
  try {
    // Get the token from the header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authorization required' });
    }

    // Verify token and check if user is super admin
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.userType !== 1) {
      return res.status(403).json({ message: 'Super admin access required' });
    }

    // Get all users
    const users = await User.find({}, '-password').sort({ createdAt: -1 }); // Exclude password field, sort by newest first
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router; 