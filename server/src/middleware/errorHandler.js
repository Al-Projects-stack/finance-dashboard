const isProd = process.env.NODE_ENV === 'production';

module.exports = (err, req, res, next) => {
  // Always log full error server-side for debugging
  console.error(err);

  /* ── Zod validation error ──────────────────────────── */
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error:   'Validation error',
      details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  /* ── PostgreSQL unique violation ───────────────────── */
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Email already registered' });
  }

  /* ── PostgreSQL foreign key violation ──────────────── */
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referenced resource not found' });
  }

  /* ── JWT errors ────────────────────────────────────── */
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  /* ── Explicit HTTP errors (status set by route) ─────── */
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }

  /* ── Everything else: never leak internals in prod ──── */
  res.status(500).json({
    error: isProd ? 'Something went wrong. Please try again.' : err.message,
  });
};
