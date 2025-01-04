const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const authenticateToken = require('./middleware/auth');

const app = express();

// Database connection
const db = mysql.createConnection({
  host: '3.135.203.67',
  user: 'root',
  password: 'Shivaansh14@',
  database: 'Job_Application_Tracker'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Make db available to routes
app.locals.db = db;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', authenticateToken, jobRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server shutdown
process.on('SIGINT', () => {
  db.end((err) => {
    console.log('Database connection closed.');
    process.exit(err ? 1 : 0);
  });
});
