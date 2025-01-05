const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Apply middleware to all routes
router.use(verifyToken);

// Get all jobs for logged in user
router.get('/', async (req, res) => {
    try {
        console.log('Fetching jobs for user:', req.user.id);
        const [rows] = await pool.query(
            'SELECT * FROM jobs WHERE user_id = ? ORDER BY applied_date DESC',
            [req.user.id]
        );
        console.log('Jobs fetched:', rows.length);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching jobs',
            error: error.message 
        });
    }
});

// Add job for logged in user
router.post('/', async (req, res) => {
    try {
        const { company, position, status, applied_date, salary, notes } = req.body;
        console.log('Adding job for user:', req.user.id, 'Data:', req.body);

        const [result] = await pool.query(
            'INSERT INTO jobs (user_id, company, position, status, applied_date, salary, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, company, position, status, applied_date, salary, notes]
        );

        console.log('Job added successfully:', result.insertId);
        res.json({ 
            success: true, 
            message: 'Job added successfully',
            jobId: result.insertId 
        });
    } catch (error) {
        console.error('Error adding job:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error adding job',
            error: error.message 
        });
    }
});

// Update job for logged in user
router.put('/:id', async (req, res) => {
    try {
        const { company, position, status, applied_date, salary, notes } = req.body;
        console.log('Updating job:', req.params.id, 'for user:', req.user.id);

        const [result] = await pool.query(
            'UPDATE jobs SET company=?, position=?, status=?, applied_date=?, salary=?, notes=? WHERE id=? AND user_id=?',
            [company, position, status, applied_date, salary, notes, req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Job not found or not authorized' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Job updated successfully' 
        });
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating job',
            error: error.message 
        });
    }
});

// Delete job for logged in user
router.delete('/:id', async (req, res) => {
    try {
        console.log('Deleting job:', req.params.id, 'for user:', req.user.id);
        const [result] = await pool.query(
            'DELETE FROM jobs WHERE id = ? AND user_id = ?', 
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Job not found or not authorized' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Job deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting job',
            error: error.message 
        });
    }
});

module.exports = router;
