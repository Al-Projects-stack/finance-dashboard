require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const path      = require('path');
const fs        = require('fs');
const { Pool }  = require('pg');
const errorHandler = require('./src/middleware/errorHandler');

const app     = express();
const PORT    = process.env.PORT || 5000;
const isProd  = process.env.NODE_ENV === 'production';
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

/* ── Security headers ───────────────────────────────────────────────── */
app.use(helmet());

/* ── CORS ───────────────────────────────────────────────────────────── */
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

/* ── Body parsing — 10 kb limit prevents large-payload DoS ─────────── */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

/* ── Rate limiting ──────────────────────────────────────────────────── */

// Auth endpoints: 10 attempts per 15 minutes (brute-force protection)
const authLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,
  max:              10,
  standardHeaders:  true,
  legacyHeaders:    false,
  message:          { error: 'Too many requests, please try again later.' },
  skipSuccessfulRequests: false,
});

// General API: 200 requests per minute
const apiLimiter = rateLimit({
  windowMs:        60 * 1000,
  max:             200,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Too many requests, please try again later.' },
});

/* ── Routes ─────────────────────────────────────────────────────────── */
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth',         authLimiter, require('./src/routes/auth'));
app.use('/api/transactions', apiLimiter,  require('./src/routes/transactions'));

/* ── Serve built React app in production ────────────────────────────── */
if (isProd && fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (_req, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));
}

/* ── Global error handler ───────────────────────────────────────────── */
app.use(errorHandler);

migrate().then(() => {
  app.listen(PORT, () => console.log(`Server ready on port ${PORT}`));
});
