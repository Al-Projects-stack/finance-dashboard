import { useState } from 'react';
import { IconFilter } from '../Icons';
import styles from './Transactions.module.css';

export default function TransactionFilters({ onFilter }) {
  const [form, setForm] = useState({
    type: '', startDate: '', endDate: '', category: '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const apply = (e) => {
    e.preventDefault();
    const p = {};
    if (form.type)      p.type      = form.type;
    if (form.startDate) p.startDate = form.startDate;
    if (form.endDate)   p.endDate   = form.endDate;
    if (form.category)  p.category  = form.category;
    onFilter({ ...p, page: 1 });
  };

  const reset = () => {
    setForm({ type: '', startDate: '', endDate: '', category: '' });
    onFilter({ page: 1 });
  };

  return (
    <form className={styles.filters} onSubmit={apply}>
      <span className={styles.filterIcon}><IconFilter width={15} height={15} /></span>

      <select value={form.type} onChange={(e) => set('type', e.target.value)}>
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        type="text"
        placeholder="Filter by category…"
        value={form.category}
        onChange={(e) => set('category', e.target.value)}
      />

      <input
        type="date"
        value={form.startDate}
        onChange={(e) => set('startDate', e.target.value)}
      />
      <input
        type="date"
        value={form.endDate}
        onChange={(e) => set('endDate', e.target.value)}
      />

      <button type="submit"  className="btn btn-primary  btn-sm">Apply</button>
      <button type="button"  className="btn btn-ghost    btn-sm" onClick={reset}>Reset</button>
    </form>
  );
}
