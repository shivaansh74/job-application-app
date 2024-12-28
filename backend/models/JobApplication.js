// JobApplication.js

const mongoose = require('mongoose');

// Define the JobApplication schema
const jobApplicationSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  jobLink: { type: String, required: true },
  status: { type: String, required: true },
  notes: { type: String, required: false },
}, { timestamps: true });

// Create a model based on the schema
const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;
