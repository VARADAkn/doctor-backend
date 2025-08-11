const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models');

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

app.use('/api/auth', require('./routes/auth.routes'));

db.sequelize.authenticate()
  .then(() => {
    console.log('✅ DB connected');
    return db.sequelize.sync();
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

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
});