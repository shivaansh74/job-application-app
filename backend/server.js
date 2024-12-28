// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// Import routes
const jobRoutes = require('./routes/jobRoutes');

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Use routes
app.use('/api/job-applications', jobRoutes);

// Sample route to test
app.get('/', (req, res) => {
  res.send('Job Application Tracker API is working');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
