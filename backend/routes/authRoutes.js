const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Register route
router.post('/register', async (req, res) => {
    try {
        console.log('Registration attempt:', req.body);
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if user exists
        const [existingUsers] = await pool.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        console.log('User registered successfully:', result.insertId);

        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Get user
        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        const user = users[0];

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Create token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
});

// Verify identity
router.post('/verify-identity', async (req, res) => {
    try {
        const { email, username } = req.body;
        
        // Check if user exists
        const [users] = await pool.query(
            'SELECT id, email, username FROM users WHERE email = ? AND username = ?',
            [email, username]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No user found with these credentials'
            });
        }

        // Generate verification code
        const verificationCode = Math.random().toString(36).slice(-8);
        
        // Store verification code in database with expiration
        await pool.query(
            'UPDATE users SET reset_code = ?, reset_code_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?',
            [verificationCode, users[0].id]
        );

        // In a real application, you would send this code via email
        // For now, we'll just return it in the response
        res.json({
            success: true,
            message: 'Verification code sent to email',
            user: {
                email: users[0].email,
                username: users[0].username
            },
            verificationCode // Remove this in production!
        });

    } catch (error) {
        console.error('Verify identity error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during identity verification'
        });
    }
});

// Verify code
router.post('/verify-code', async (req, res) => {
    try {
        const { email, code } = req.body;
        
        const [users] = await pool.query(
            'SELECT id FROM users WHERE email = ? AND reset_code = ? AND reset_code_expires > NOW()',
            [email, code]
        );

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification code'
            });
        }

        res.json({
            success: true,
            message: 'Code verified successfully'
        });

    } catch (error) {
        console.error('Verify code error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during code verification'
        });
    }
});

// Reset password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        
        // Verify code again
        const [users] = await pool.query(
            'SELECT id FROM users WHERE email = ? AND reset_code = ? AND reset_code_expires > NOW()',
            [email, code]
        );

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification code'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset code
        await pool.query(
            'UPDATE users SET password = ?, reset_code = NULL, reset_code_expires = NULL WHERE id = ?',
            [hashedPassword, users[0].id]
        );

        res.json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during password reset'
        });
    }
});

// Add a test route to verify the endpoint is working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route is working' });
});

module.exports = router; 