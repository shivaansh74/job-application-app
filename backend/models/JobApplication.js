// models/JobApplication.js
const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'interviewed', 'accepted', 'rejected'],
    default: 'applied'
  },
  location: String,
  salary: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
jobApplicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;
