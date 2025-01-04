const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  const { username, password } = req.body;
  const db = req.app.locals.db;

  console.log('Login attempt for username:', username); // Debug log

  try {
    db.query(
      'SELECT * FROM users WHERE username = ?',
      [username],
      async (error, results) => {
        if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ message: 'Server error' });
        }

        console.log('Query results:', results); // Debug log

        if (results.length === 0) {
          console.log('User not found'); // Debug log
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);

        console.log('Password validation:', validPassword); // Debug log

        if (!validPassword) {
          console.log('Invalid password'); // Debug log
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { userId: user.id, username: user.username },
          'your_jwt_secret',
          { expiresIn: '24h' }
        );

        console.log('Login successful, token generated'); // Debug log
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a test route to verify the endpoint is working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route is working' });
});

module.exports = router; 