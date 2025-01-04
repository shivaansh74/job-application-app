const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// Debug middleware for job routes
router.use((req, res, next) => {
  console.log('Job Route:', req.method, req.path);
  next();
});

// Get all jobs
router.get('/', authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single job
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Get job by ID:', req.params.id);
    console.log('User ID:', req.user.id);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }

    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error getting job:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create job
router.post('/', authMiddleware, async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      user: req.user.id
    });
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update job
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete job
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this route to your existing jobRoutes.js
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    // Get total jobs
    const total = await Job.countDocuments({ user: req.user.id });

    // Get jobs by status
    const byStatus = {
      applied: await Job.countDocuments({ user: req.user.id, status: 'applied' }),
      interviewed: await Job.countDocuments({ user: req.user.id, status: 'interviewed' }),
      accepted: await Job.countDocuments({ user: req.user.id, status: 'accepted' }),
      rejected: await Job.countDocuments({ user: req.user.id, status: 'rejected' })
    };

    // Calculate rates
    const responseRate = total ? (byStatus.interviewed + byStatus.accepted + byStatus.rejected) / total : 0;
    const successRate = total ? byStatus.accepted / total : 0;

    // Get timeline data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const timeline = await Job.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          date: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    res.json({
      stats: {
        total,
        byStatus,
        responseRate,
        successRate
      },
      timeline
    });

  } catch (error) {
    console.error('Error getting job stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
});

module.exports = router;
