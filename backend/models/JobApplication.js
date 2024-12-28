// models/JobApplication.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, required: true },
}, { timestamps: true });

const JobApplication = mongoose.model('JobApplication', jobSchema);

module.exports = JobApplication;
