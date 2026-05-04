require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const CATEGORIES_EXPENSE = ['Housing', 'Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Education'];
const CATEGORIES_INCOME  = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other'];

function randomBetween(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(2);
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Demo user
    const hash = await bcrypt.hash('password123', 12);
    const userRes = await client.query(
      `INSERT INTO users (email, password_hash, full_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
       RETURNING id`,
      ['demo@example.com', hash, 'Alex Johnson']
    );
    const userId = userRes.rows[0].id;

    // Delete existing seed transactions to keep idempotent
    await client.query('DELETE FROM transactions WHERE user_id = $1', [userId]);

    const transactions = [];

    // Generate 12 months of realistic data
    for (let month = 11; month >= 0; month--) {
      const base = new Date();
      base.setMonth(base.getMonth() - month);

      // Monthly salary (1st of month)
      const salaryDate = new Date(base.getFullYear(), base.getMonth(), 1).toISOString().split('T')[0];
      transactions.push([userId, 'income', 'Salary', randomBetween(4500, 6000), 'Monthly salary', salaryDate]);

      // Occasional freelance
      if (Math.random() > 0.4) {
        const d = new Date(base.getFullYear(), base.getMonth(), randomBetween(5, 25));
        transactions.push([userId, 'income', 'Freelance', randomBetween(300, 1500), 'Freelance project', d.toISOString().split('T')[0]]);
      }

      // 8-14 expenses per month
      const expenseCount = Math.floor(randomBetween(8, 14));
      for (let i = 0; i < expenseCount; i++) {
        const day = Math.floor(randomBetween(1, 28));
        const d = new Date(base.getFullYear(), base.getMonth(), day).toISOString().split('T')[0];
        const cat = randomItem(CATEGORIES_EXPENSE);
        const amounts = { Housing: [800, 1800], Food: [20, 200], Transport: [15, 150], Entertainment: [10, 120], Health: [20, 300], Shopping: [30, 400], Utilities: [50, 180], Education: [30, 250] };
        const [lo, hi] = amounts[cat];
        transactions.push([userId, 'expense', cat, randomBetween(lo, hi), `${cat} expense`, d]);
      }
    }

    // Bulk insert
    for (const t of transactions) {
      await client.query(
        `INSERT INTO transactions (user_id, type, category, amount, description, date)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        t
      );
    }

    await client.query('COMMIT');
    console.log(`✓ Seeded ${transactions.length} transactions for demo@example.com (password: password123)`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
