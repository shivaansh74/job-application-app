const express = require('express');
const router = express.Router();

// Get all jobs
router.get('/', (req, res) => {
  const db = req.app.locals.db;
  const userId = req.user.userId;

  db.query(
    'SELECT * FROM jobs WHERE user_id = ? ORDER BY applied_date DESC',
    [userId],
    (error, results) => {
      if (error) {
        console.error('Error fetching jobs:', error);
        return res.status(500).json({ message: 'Error fetching jobs' });
      }
      res.json(results);
    }
  );
});

// Add new job
router.post('/', (req, res) => {
  const db = req.app.locals.db;
  const userId = req.user.userId;
  const { company, position, status, applied_date, notes, salary } = req.body;

  console.log('Received job data:', req.body); // Debug log

  db.query(
    'INSERT INTO jobs (user_id, company, position, status, applied_date, notes, salary) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [userId, company, position, status, applied_date, notes, salary || null],
    (error, results) => {
      if (error) {
        console.error('Error adding job:', error);
        return res.status(500).json({ message: 'Error adding job' });
      }
      res.status(201).json({ 
        message: 'Job added successfully',
        jobId: results.insertId 
      });
    }
  );
});

// Update job
router.put('/:id', (req, res) => {
  const db = req.app.locals.db;
  const jobId = req.params.id;
  const userId = req.user.userId;
  const { company, position, status, applied_date, notes, salary } = req.body;

  console.log('Updating job with data:', req.body); // Debug log

  db.query(
    'UPDATE jobs SET company = ?, position = ?, status = ?, applied_date = ?, notes = ?, salary = ? WHERE id = ? AND user_id = ?',
    [company, position, status, applied_date, notes, salary || null, jobId, userId],
    (error, results) => {
      if (error) {
        console.error('Error updating job:', error);
        return res.status(500).json({ message: 'Error updating job' });
      }
      res.json({ message: 'Job updated successfully' });
    }
  );
});

// Delete job
router.delete('/:id', (req, res) => {
  const db = req.app.locals.db;
  const jobId = req.params.id;
  const userId = req.user.userId;

  db.query(
    'DELETE FROM jobs WHERE id = ? AND user_id = ?',
    [jobId, userId],
    (error, results) => {
      if (error) {
        console.error('Error deleting job:', error);
        return res.status(500).json({ message: 'Error deleting job' });
      }
      res.json({ message: 'Job deleted successfully' });
    }
  );
});

module.exports = router;
