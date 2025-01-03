const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const authMiddleware = require('../middleware/authMiddleware');

// Test route - must come before general routes
router.get('/test', authMiddleware, async (req, res) => {
  try {
    res.json({ message: 'Job routes are working' });
  } catch (error) {
    res.status(500).json({ message: 'Test route error', error: error.message });
  }
});

// Stats route - must come before general routes
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    console.log('Stats route accessed');
    console.log('User ID:', req.user.userId);

    // Test database connection
    const jobCount = await JobApplication.countDocuments({ userId: req.user.userId });
    console.log('Total jobs found:', jobCount);

    // If no jobs, return empty stats
    if (jobCount === 0) {
      return res.json({
        stats: {
          total: 0,
          byStatus: {
            applied: 0,
            interviewed: 0,
            accepted: 0,
            rejected: 0
          },
          responseRate: 0,
          successRate: 0
        },
        timeline: Array(30).fill({ count: 0 }).map((_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          count: 0
        }))
      });
    }

    const jobs = await JobApplication.find({ userId: req.user.userId });

    // Initialize default status counts
    const byStatus = {
      applied: 0,
      interviewed: 0,
      accepted: 0,
      rejected: 0
    };

    // Count jobs by status
    jobs.forEach(job => {
      byStatus[job.status] = (byStatus[job.status] || 0) + 1;
    });

    // Calculate rates
    const total = jobs.length;
    const responded = byStatus.interviewed + byStatus.accepted + byStatus.rejected;
    const completed = byStatus.accepted + byStatus.rejected;
    
    const responseRate = total > 0 ? responded / total : 0;
    const successRate = completed > 0 ? byStatus.accepted / completed : 0;

    // Generate timeline data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const timeline = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      const count = jobs.filter(job => {
        const jobDate = new Date(job.createdAt).toISOString().split('T')[0];
        return jobDate === dateString;
      }).length;

      timeline.push({ date: dateString, count });
    }

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
    console.error('Stats route error:', error);
    res.status(500).json({ 
      message: 'Error fetching statistics', 
      error: error.message,
      stack: error.stack 
    });
  }
});

// General CRUD routes come after specific routes
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching jobs for user:', req.user.userId);
    const jobs = await JobApplication.find({ userId: req.user.userId })
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// Add a new job
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newJob = new JobApplication({
      ...req.body,
      userId: req.user.userId
    });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Error creating job', error: error.message });
  }
});

// Update a job
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Error updating job', error: error.message });
  }
});

// Delete a job
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const jobId = req.params.id;
    await JobApplication.findByIdAndDelete(jobId);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error });
  }
});

// Export the router
module.exports = router;
