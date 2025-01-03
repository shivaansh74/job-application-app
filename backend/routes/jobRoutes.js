const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const jwt = require('jsonwebtoken');

// Middleware to verify token and get userId
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authorization required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all jobs for the logged-in user
router.get('/', async (req, res) => {
  try {
    const jobs = await JobApplication.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// Create a new job
router.post('/', async (req, res) => {
  try {
    const newJob = new JobApplication({
      ...req.body,
      userId: req.user.userId
    });
    
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: 'Error creating job', error: error.message });
  }
});

// Get a specific job
router.get('/:id', async (req, res) => {
  try {
    const job = await JobApplication.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job' });
  }
});

// Update a job
router.put('/:id', async (req, res) => {
  try {
    const job = await JobApplication.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const updatedJob = await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: 'Error updating job' });
  }
});

// Delete a job
router.delete('/:id', async (req, res) => {
  try {
    const job = await JobApplication.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await JobApplication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job' });
  }
});

module.exports = router;
