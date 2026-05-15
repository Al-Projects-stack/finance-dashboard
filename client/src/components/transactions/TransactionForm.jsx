import { useState, useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import styles from './Transactions.module.css';

const CATEGORIES = {
  expense: ['Housing', 'Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Education', 'Other'],
  income:  ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other'],
};

const empty = {
  type: 'expense',
  category: 'Food',
  amount: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
};

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

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
    /* Skill: modal overlay with backdrop blur */
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={editTarget ? 'Edit transaction' : 'Add transaction'}>
      <div className={`glass-card ${styles.modal}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{editTarget ? 'Edit Transaction' : 'New Transaction'}</h2>
          {/* Skill: cursor-pointer, focus visible, SVG icon */}
          <button className={`btn btn-ghost btn-icon ${styles.closeBtn}`} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Skill: loading → error state visible near problem */}
        {error && <div className="error-msg">{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Type toggle — income uses green CTA per skill */}
          <div className={styles.typeToggle}>
            <button
              type="button"
              className={`btn ${form.type === 'expense' ? 'btn-primary' : 'btn-ghost'} ${styles.typeBtn}`}
              onClick={() => { set('type', 'expense'); set('category', 'Food'); }}
            >
              Expense
            </button>
            <button
              type="button"
              className={`btn ${form.type === 'income' ? 'btn-cta' : 'btn-ghost'} ${styles.typeBtn}`}
              onClick={() => { set('type', 'income'); set('category', 'Salary'); }}
            >
              Income
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className="form-group">
              <label htmlFor="txn-amount">Amount (R)</label>
              <input
                id="txn-amount"
                type="number" step="0.01" min="0.01" max="1000000000" required
                placeholder="0.00"
                inputMode="decimal"
                value={form.amount}
                onChange={(e) => {
                  // Strip anything that isn't a digit or single dot
                  const raw = e.target.value.replace(/[^0-9.]/g, '');
                  const parts = raw.split('.');
                  const clean = parts.length > 2
                    ? parts[0] + '.' + parts.slice(1).join('')
                    : raw;
                  set('amount', clean);
                }}
                onKeyDown={(e) => {
                  // Block e, E, +, - (valid in HTML number but not for money)
                  if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData('text');
                  const numeric = pasted.replace(/[^0-9.]/g, '');
                  const parts = numeric.split('.');
                  const clean = parts.length > 2
                    ? parts[0] + '.' + parts.slice(1).join('')
                    : numeric;
                  set('amount', clean);
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="txn-category">Category</label>
              <select id="txn-category" value={form.category} onChange={(e) => set('category', e.target.value)}>
                {cats.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="txn-date">Date</label>
              <input
                id="txn-date"
                type="date" required
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="txn-desc">Description (optional)</label>
              <input
                id="txn-desc"
                type="text" maxLength={500}
                placeholder="What was this for?"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            {/* Skill: disable button during async, loading state */}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : (editTarget ? 'Update' : 'Add Transaction')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
