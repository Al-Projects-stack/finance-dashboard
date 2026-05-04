import { useState, useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import styles from './Transactions.module.css';

const CATEGORIES = {
  expense: ['Housing', 'Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Education', 'Other'],
  income:  ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other'],
};

const empty = { type: 'expense', category: 'Food', amount: '', description: '', date: new Date().toISOString().split('T')[0] };

export default function TransactionForm({ editTarget, onClose }) {
  const { createTransaction, updateTransaction } = useTransactions();
  const [form, setForm]   = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editTarget) {
      setForm({
        type:        editTarget.type,
        category:    editTarget.category,
        amount:      String(editTarget.amount),
        description: editTarget.description ?? '',
        date:        editTarget.date.split('T')[0],
      });
    }
  }, [editTarget]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (editTarget) await updateTransaction(editTarget.id, payload);
      else            await createTransaction(payload);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.details?.[0]?.message || 'Something went wrong';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const cats = CATEGORIES[form.type] || [];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`glass-card ${styles.modal}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{editTarget ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Type toggle */}
          <div className={styles.typeToggle}>
            <button
              type="button"
              className={`btn ${form.type === 'expense' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => { set('type', 'expense'); set('category', 'Food'); }}
            >
              Expense
            </button>
            <button
              type="button"
              className={`btn ${form.type === 'income' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => { set('type', 'income'); set('category', 'Salary'); }}
            >
              Income
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className="form-group">
              <label>Amount (R)</label>
              <input
                type="number" step="0.01" min="0.01" required
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}>
                {cats.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date" required
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Description (optional)</label>
              <input
                type="text" maxLength={500}
                placeholder="What was this for?"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : (editTarget ? 'Update' : 'Add Transaction')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
