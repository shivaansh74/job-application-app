const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');

// Get all job applications
router.get('/', async (req, res) => {
  try {
    const jobs = await JobApplication.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create a new job application
router.post('/', async (req, res) => {
  try {
    const newJob = new JobApplication(req.body);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update a job application status
router.patch('/:id', async (req, res) => {
  try {
    const updatedJob = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedJob);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete a job application
router.delete('/:id', async (req, res) => {
  try {
    await JobApplication.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
