const mongoose = require('mongoose');

// Define the JobApplication schema
const jobApplicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, default: 'applied' },  // Default status is 'applied'
});

// Create the JobApplication model
const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;
