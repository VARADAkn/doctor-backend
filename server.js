const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = 3000;

// MIDDLEWARE
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true   
}));
app.use(bodyParser.json());

// SESSION SETUP
const store = new SequelizeStore({
  db: db.sequelize,
});

app.use(session({
  secret: 'supersecretkey',  
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, 
    httpOnly: true,
    secure: false
  }
}));

store.sync(); 

// ROUTES
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

app.use('/api/auth', require('./routes/auth.routes'));

// ERROR HANDLER
app.use(errorHandler);

// DATABASE + SERVER START
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ DB connected');
   return db.sequelize.sync(); // no { force: true }

  })
  .then(() => {
    console.log('✅ Database synced');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB or sync:', err);
  });

// UNHANDLED REJECTION HANDLER
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
});
