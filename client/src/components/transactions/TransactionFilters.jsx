import { useState } from 'react';
import styles from './Transactions.module.css';

const MIN_DATE = '2000-01-01';
const MAX_DATE = '2100-12-31';

export default function TransactionFilters({ onFilter }) {
  const [form, setForm] = useState({ type: '', startDate: '', endDate: '', category: '' });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const apply = (e) => {
    e.preventDefault();
    const params = {};
    if (form.type)      params.type      = form.type;
    if (form.startDate) params.startDate = form.startDate;
    if (form.endDate)   params.endDate   = form.endDate;
    // Trim and strip anything that looks like HTML before sending
    if (form.category)  params.category  = form.category.trim().replace(/<[^>]*>/g, '');
    onFilter({ ...params, page: 1 });
  };

  const reset = () => {
    setForm({ type: '', startDate: '', endDate: '', category: '' });
    onFilter({ page: 1 });
  };

  return (
    <form className={styles.filters} onSubmit={apply} aria-label="Filter transactions">
      <select
        value={form.type}
        onChange={(e) => set('type', e.target.value)}
        aria-label="Filter by type"
      >
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        type="text"
        placeholder="Category..."
        value={form.category}
        maxLength={100}
        aria-label="Filter by category"
        onChange={(e) => set('category', e.target.value)}
      />

      <input
        type="date"
        value={form.startDate}
        min={MIN_DATE} max={MAX_DATE}
        aria-label="Start date"
        onChange={(e) => set('startDate', e.target.value)}
      />
      <input
        type="date"
        value={form.endDate}
        min={MIN_DATE} max={MAX_DATE}
        aria-label="End date"
        onChange={(e) => set('endDate', e.target.value)}
      />

      <button type="submit" className="btn btn-primary btn-sm">Filter</button>
      <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>Reset</button>
    </form>
  );
}
