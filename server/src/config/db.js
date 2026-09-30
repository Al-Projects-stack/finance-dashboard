const { Pool } = require('pg');

// Internal Render hostnames (e.g. dpg-xxx-a) have no dots and don't
// speak SSL. External hosts (e.g. xxx.oregon-postgres.render.com) do.
function useSsl() {
  if (process.env.PGSSLMODE === 'require') return true;
  if (process.env.PGSSLMODE === 'disable') return false;
  try {
    return new URL(process.env.DATABASE_URL).hostname.includes('.');
  } catch {
    return process.env.NODE_ENV === 'production';
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl() ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});

pool.on('error', (err) => {
  console.error('Idle client error:', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
