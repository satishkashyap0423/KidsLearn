const express = require('express');
const path = require('path');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const progressRoutes = require('./routes/progressRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);

// Serve static files from the client directory in development and production
// This makes the server capable of serving the client build files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle any API requests that don't match the above routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    message: 'API endpoint not found',
  });
});

// Catch-all route to serve the React app for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

module.exports = app;
