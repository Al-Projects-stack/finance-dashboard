const { z } = require('zod');

const registerSchema = z.object({
  email:     z.string().email('Invalid email'),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2).max(255),
});

const loginSchema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const transactionSchema = z.object({
  type:        z.enum(['income', 'expense']),
  category:    z.string().min(1).max(100),
  amount:      z.number().positive('Amount must be positive'),
  description: z.string().max(500).optional().nullable(),
  date:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});

const transactionUpdateSchema = transactionSchema.partial();

module.exports = { registerSchema, loginSchema, transactionSchema, transactionUpdateSchema };
