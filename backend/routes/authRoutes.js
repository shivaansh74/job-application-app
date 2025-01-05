const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/register', async (req, res) => {
  const db = req.app.locals.db;
  const { username, email, password } = req.body;

  try {
    // Check if username already exists
    const userExists = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, email],
        (error, results) => {
          if (error) reject(error);
          else resolve(results);
        }
      );
    });

    if (userExists.length > 0) {
      return res.status(400).json({ 
        message: 'Username or email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      (error, results) => {
        if (error) {
          console.error('Registration error:', error);
          return res.status(500).json({ 
            message: 'Error registering user' 
          });
        }
        res.status(201).json({ 
          message: 'User registered successfully' 
        });
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user' 
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body); // Debug log

    const { username, password } = req.body;
    const db = req.app.locals.db;

    // Query the database
    db.query(
      'SELECT * FROM users WHERE username = ?',
      [username],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        console.log('Query results:', results); // Debug log

        if (results.length > 0) {
          // For now, accept any password (you should use proper password verification)
          res.json({
            success: true,
            token: 'test-token',
            user: {
              id: results[0].id,
              username: results[0].username
            }
          });
        } else {
          res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Add a test route to verify the endpoint is working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route is working' });
});

module.exports = router; 