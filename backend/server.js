const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Test route to verify server is working
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Debug route to see if auth routes are mounted
app.get('/api/auth/test', (req, res) => {
    res.json({ message: 'Auth routes are mounted' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- POST /api/auth/login');
    console.log('- POST /api/auth/register');
    console.log('- GET /api/jobs');
});

module.exports = app;
