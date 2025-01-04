const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  user: {
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
  location: {
    type: String
  },
  salary: {
    type: String
  },
  status: {
    type: String,
    enum: ['applied', 'interviewed', 'accepted', 'rejected'],
    default: 'applied'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Add index for better query performance
jobSchema.index({ user: 1, createdAt: -1 });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job; 