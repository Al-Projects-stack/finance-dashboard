const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { registerSchema, loginSchema } = require('../schemas/validation');

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const hash = await bcrypt.hash(data.password, 12);

    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, full_name)
       VALUES ($1, $2, $3)
       RETURNING id, email, full_name, created_at`,
      [data.email, hash, data.full_name]
    );

    res.status(201).json({ user: rows[0], token: signToken(rows[0].id) });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [data.email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(data.password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password_hash, ...safe } = user;
    res.json({ user: safe, token: signToken(user.id) });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, email, full_name, created_at FROM users WHERE id = $1',
      [req.userId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };
