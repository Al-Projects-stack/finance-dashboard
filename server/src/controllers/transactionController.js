const db = require('../config/db');
const {
  transactionSchema,
  transactionUpdateSchema,
  listQuerySchema,
  idParamSchema,
} = require('../schemas/validation');

/* Explicit allowlist of columns that may appear in SET clauses */
const UPDATABLE_FIELDS = new Set(['type', 'category', 'amount', 'description', 'date']);

/* ── GET /transactions ── */
const getAll = async (req, res, next) => {
  try {
    // Validate and sanitize all query params — prevents NaN offsets, huge limits, injection
    const q = listQuerySchema.parse(req.query);
    const { type, startDate, endDate, category, page, limit } = q;
    const offset = (page - 1) * limit;

    const conditions = ['user_id = $1'];
    const params     = [req.userId];
    let   idx        = 2;

    if (type)      { conditions.push(`type = $${idx++}`);         params.push(type); }
    if (startDate) { conditions.push(`date >= $${idx++}`);        params.push(startDate); }
    if (endDate)   { conditions.push(`date <= $${idx++}`);        params.push(endDate); }
    if (category)  { conditions.push(`category ILIKE $${idx++}`); params.push(`%${category}%`); }

    const where = conditions.join(' AND ');

    const [countRes, dataRes] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM transactions WHERE ${where}`, params),
      db.query(
        `SELECT * FROM transactions WHERE ${where}
         ORDER BY date DESC, created_at DESC
         LIMIT $${idx++} OFFSET $${idx++}`,
        [...params, limit, offset]
      ),
    ]);

    res.json({
      transactions: dataRes.rows,
      total:        parseInt(countRes.rows[0].count, 10),
      page,
      limit,
    });
  } catch (err) {
    next(err);
  }
};

/* ── GET /transactions/summary ── */
const getSummary = async (req, res, next) => {
  try {
    const [summary, monthly, categories] = await Promise.all([
      db.query(
        `SELECT
           COALESCE(SUM(CASE WHEN type='income'  THEN amount ELSE 0      END), 0) AS total_income,
           COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0      END), 0) AS total_expenses,
           COALESCE(SUM(CASE WHEN type='income'  THEN amount ELSE -amount END), 0) AS balance
         FROM transactions WHERE user_id = $1`,
        [req.userId]
      ),
      db.query(
        `SELECT
           TO_CHAR(date, 'YYYY-MM') AS month,
           COALESCE(SUM(CASE WHEN type='income'  THEN amount ELSE 0 END), 0) AS income,
           COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END), 0) AS expenses
         FROM transactions
         WHERE user_id = $1 AND date >= NOW() - INTERVAL '12 months'
         GROUP BY month ORDER BY month ASC`,
        [req.userId]
      ),
      db.query(
        `SELECT category, COALESCE(SUM(amount), 0) AS total
         FROM transactions
         WHERE user_id = $1 AND type = 'expense'
         GROUP BY category ORDER BY total DESC LIMIT 10`,
        [req.userId]
      ),
    ]);

    const { total_income, total_expenses, balance } = summary.rows[0];
    const income   = parseFloat(total_income);
    const expenses = parseFloat(total_expenses);
    const savings_rate = income > 0
      ? parseFloat(((income - expenses) / income * 100).toFixed(1))
      : 0;

    res.json({
      summary:    { total_income: income, total_expenses: expenses, balance: parseFloat(balance), savings_rate },
      monthly:    monthly.rows.map((r) => ({ month: r.month, income: parseFloat(r.income), expenses: parseFloat(r.expenses) })),
      categories: categories.rows.map((r) => ({ category: r.category, total: parseFloat(r.total) })),
    });
  } catch (err) {
    next(err);
  }
};

/* ── GET /transactions/:id ── */
const getOne = async (req, res, next) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const { rows } = await db.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ transaction: rows[0] });
  } catch (err) {
    next(err);
  }
};

/* ── POST /transactions ── */
const create = async (req, res, next) => {
  try {
    const data = transactionSchema.parse(req.body);
    const { rows } = await db.query(
      `INSERT INTO transactions (user_id, type, category, amount, description, date)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.userId, data.type, data.category, data.amount, data.description ?? null, data.date]
    );
    res.status(201).json({ transaction: rows[0] });
  } catch (err) {
    next(err);
  }
};

/* ── PUT /transactions/:id ── */
const update = async (req, res, next) => {
  try {
    const { id }   = idParamSchema.parse(req.params);
    const data     = transactionUpdateSchema.parse(req.body);

    // Explicit allowlist — even if Zod were misconfigured, no unknown column can appear
    const fields = Object.keys(data).filter((f) => UPDATABLE_FIELDS.has(f));
    if (!fields.length) return res.status(400).json({ error: 'No valid fields to update' });

    const setClauses = fields.map((f, i) => `${f} = $${i + 3}`).join(', ');
    const values     = fields.map((f) => data[f]);

    const { rows } = await db.query(
      `UPDATE transactions SET ${setClauses} WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, req.userId, ...values]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ transaction: rows[0] });
  } catch (err) {
    next(err);
  }
};

/* ── DELETE /transactions/:id ── */
const remove = async (req, res, next) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const { rows } = await db.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getSummary, getOne, create, update, remove };
