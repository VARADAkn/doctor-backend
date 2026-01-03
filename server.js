// ✅ Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

// 📦 Import Database and Models
const db = require("./models");

// 🗝️ Initialize Session Store
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sessionStore = new SequelizeStore({
  db: db.sequelize,
  tableName: 'Sessions',
});

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3005;

// 🧩 MIDDLEWARES
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Global Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    const logBody = { ...req.body };
    if (logBody.password) logBody.password = '********';
    console.log('Body:', JSON.stringify(logBody));
  }
  next();
});

// 🗝️ SESSION SETUP
app.use(session({
  secret: process.env.SESSION_SECRET || 'test-secret-key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Sync the session store table
sessionStore.sync();

// Serve static files
app.use(express.static(path.join(__dirname, 'front-end')));

// Root route redirects to login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'login.html'));
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const routes = require('./routes');
const doctorDashboardRoutes = require('./routes/doctorDashboard.routes');
//const auditLogRoutes = require('./routes/auditlog.routes');

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api', routes);
app.use('/api', doctorDashboardRoutes);
//app.use('/api/audit-logs', auditLogRoutes);

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API Route not found' });
});

// For any other route, serve the login page or handle appropriately
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'login.html'));
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message
  });
});



// Sync database and start server
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced successfully!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📊 Test the server at: http://localhost:${PORT}/test`);
    });
  })
  .catch((err) => {
    console.error("❌ Error syncing database:", err);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});