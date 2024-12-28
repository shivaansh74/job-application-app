// jobRoutes.js

const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication'); // Import the JobApplication model

// Get all job applications
router.get('/', async (req, res) => {
  try {
    const jobApplications = await JobApplication.find();
    res.json(jobApplications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new job application
router.post('/', async (req, res) => {
  const { company, position, jobLink, status, notes } = req.body;

  const jobApplication = new JobApplication({
    company,
    position,
    jobLink,
    status,
    notes,
  });

  try {
    const newJobApplication = await jobApplication.save();
    res.status(201).json(newJobApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a job application status
router.patch('/:id', async (req, res) => {
  try {
    const updatedJobApplication = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedJobApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a job application
router.delete('/:id', async (req, res) => {
  try {
    await JobApplication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job application deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
