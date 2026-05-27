const { z } = require('zod');

/* ── Helpers ─────────────────────────────────────────────────────────── */

// Strip leading/trailing whitespace and collapse internal runs
const trimmed = (schema) => schema.transform((s) => s.trim());

// Reject strings that contain HTML/script injection patterns
const noHtml = (schema) =>
  schema.refine(
    (s) => !/<[^>]*>/.test(s),
    { message: 'HTML tags are not allowed' }
  );

// Safe text: trimmed + no HTML tags
const safeText = (min, max) =>
  noHtml(trimmed(z.string().min(min).max(max)));

/* ── Auth schemas ────────────────────────────────────────────────────── */

// Preprocess email: trim and lowercase BEFORE validation so "  User@Email.COM  " is accepted
const emailField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim().toLowerCase() : v),
  z.string().email('Invalid email address').max(255)
);

const registerSchema = z.object({
  email:     emailField,
  password:  z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password too long'),
  full_name: safeText(2, 100),
});

const loginSchema = z.object({
  email:    emailField,
  password: z.string().min(1, 'Password is required').max(128),
});

/* ── Transaction body schemas ────────────────────────────────────────── */

const ALLOWED_EXPENSE_CATEGORIES = new Set([
  'Housing', 'Food', 'Transport', 'Entertainment', 'Health',
  'Shopping', 'Utilities', 'Education', 'Other',
]);
const ALLOWED_INCOME_CATEGORIES = new Set([
  'Salary', 'Freelance', 'Investment', 'Bonus', 'Other',
]);
const ALL_CATEGORIES = new Set([
  ...ALLOWED_EXPENSE_CATEGORIES,
  ...ALLOWED_INCOME_CATEGORIES,
]);

const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: "Type must be 'income' or 'expense'" }),
  }),
  category: z.string().trim().min(1).max(100).refine(
    (c) => ALL_CATEGORIES.has(c),
    { message: 'Invalid category' }
  ),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be greater than 0')
    .max(1_000_000_000, 'Amount exceeds maximum allowed value')
    .refine((n) => Number.isFinite(n), { message: 'Amount must be a finite number' }),
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .refine((s) => !/<[^>]*>/.test(s), { message: 'HTML tags are not allowed' })
    .optional()
    .nullable(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
    .refine((d) => {
      const parsed = new Date(d);
      return !isNaN(parsed.getTime());
    }, { message: 'Invalid date' })
    .refine((d) => {
      const parsed = new Date(d);
      const min = new Date('2000-01-01');
      const max = new Date('2100-12-31');
      return parsed >= min && parsed <= max;
    }, { message: 'Date out of acceptable range' }),
});

const transactionUpdateSchema = transactionSchema.partial();

/* ── Query param schema for GET /transactions ────────────────────────── */

const listQuerySchema = z.object({
  type: z.enum(['income', 'expense']).optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate must be YYYY-MM-DD')
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'endDate must be YYYY-MM-DD')
    .optional(),
  category: z
    .string()
    .trim()
    .max(100)
    .refine((s) => !/<[^>]*>/.test(s), { message: 'HTML tags are not allowed' })
    .optional(),
  page: z
    .string()
    .optional()
    .transform((v) => {
      const n = parseInt(v ?? '1', 10);
      return isNaN(n) || n < 1 ? 1 : n;
    }),
  limit: z
    .string()
    .optional()
    .transform((v) => {
      const n = parseInt(v ?? '20', 10);
      if (isNaN(n) || n < 1) return 20;
      return Math.min(n, 100); // cap at 100 rows per page
    }),
});

/* ── URL param schema ────────────────────────────────────────────────── */

const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a positive integer')
    .transform(Number),
});

module.exports = {
  registerSchema,
  loginSchema,
  transactionSchema,
  transactionUpdateSchema,
  listQuerySchema,
  idParamSchema,
};
