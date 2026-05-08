require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';
const CLIENT_DIST = path.join(__dirname, '../client/dist');

// Run DB migrations on startup
async function migrate() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) return;
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProd ? { rejectUnauthorized: false } : false,
  });
  try {
    await pool.query(fs.readFileSync(schemaPath, 'utf8'));
    console.log('DB schema ready');
  } catch (e) {
    console.error('Migration error:', e.message);
  } finally {
    await pool.end();
  }
}

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date() }));
app.use('/api/auth',         require('./src/routes/auth'));
app.use('/api/transactions', require('./src/routes/transactions'));

// Serve built React app in production
if (isProd && fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (_req, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));
}

app.use(errorHandler);

migrate().then(() => {
  app.listen(PORT, () => console.log(`Server ready on port ${PORT}`));
});
