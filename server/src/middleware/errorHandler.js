module.exports = (err, req, res, next) => {
  console.error(err);

  // Zod validation error
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  // PostgreSQL unique violation
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Email already registered' });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referenced resource not found' });
  }

  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
};
