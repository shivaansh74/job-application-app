// models/JobApplication.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, required: true, enum: ['applied', 'interviewed', 'accepted', 'rejected'], default: 'applied' },
  location: { type: String },
  salary: { type: String },
  notes: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true, collection: 'jobapplications' });

const JobApplication = mongoose.model('JobApplication', jobSchema);

module.exports = JobApplication;
