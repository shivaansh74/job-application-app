const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query,
    body: req.body
  });
  next();
});

// Mount routes - make sure these come before the 404 handler
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes); // This should handle all /api/jobs routes

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// 404 handler - this should come after all valid routes
app.use((req, res) => {
  console.log('404 - Route not found:', {
    url: req.originalUrl,
    method: req.method,
    body: req.body
  });
  res.status(404).json({
    message: 'Route not found',
    requestedUrl: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Server error', 
    error: err.message 
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Test the API at: http://localhost:${PORT}/api/test`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Export for testing
module.exports = app;
