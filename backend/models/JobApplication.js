const mongoose = require('mongoose');

// Define the schema for a job application
const jobApplicationSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  applicationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Applied', 'Interview', 'Offer', 'Rejected'], default: 'Applied' },
  jobLink: { type: String, required: true },
  notes: { type: String, default: '' },
});

// Create a model from the schema
const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;
