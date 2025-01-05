const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all jobs
router.get('/', async (req, res) => {
    try {
        console.log('Fetching jobs...');
        const [rows] = await pool.query('SELECT * FROM jobs ORDER BY applied_date DESC');
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

// Add job
router.post('/', async (req, res) => {
    try {
        const { company, position, status, applied_date, salary, notes } = req.body;
        const [result] = await pool.query(
            'INSERT INTO jobs (company, position, status, applied_date, salary, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [company, position, status, applied_date, salary, notes]
        );
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

// Update job
router.put('/:id', async (req, res) => {
    try {
        const { company, position, status, applied_date, salary, notes } = req.body;
        const [result] = await pool.query(
            'UPDATE jobs SET company=?, position=?, status=?, applied_date=?, salary=?, notes=? WHERE id=?',
            [company, position, status, applied_date, salary, notes, req.params.id]
        );
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

// Delete job
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);
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
