// ✅ Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// 🧩 MIDDLEWARES
app.use(cors({
  origin: true, // Allow all origins for testing
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic route to test if server is working
app.get('/test', (req, res) => {
  res.json({ message: '✅ Server is running!', timestamp: new Date() });
});

// 🗝️ SESSION SETUP (temporarily simplified for testing)
app.use(session({
  secret: 'test-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Import routes
const authRoutes = require('./routes/auth.routes');
const routes = require('./routes');
const doctorDashboardRoutes = require('./routes/doctorDashboard.routes'); // ADD THIS LINE

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api', routes);
app.use('/api', doctorDashboardRoutes); // ADD THIS LINE

// Basic error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const db = require("./models");

// Sync database
db.sequelize.sync({ alter: true }) // Use { force: true } if you want to drop & recreate all tables
  .then(() => {
    console.log("✅ Database synced successfully!");
  })
  .catch((err) => {
    console.error("❌ Error syncing database:", err);
  });

// Start server without database connection for testing
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Test the server at: http://localhost:${PORT}/test`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});