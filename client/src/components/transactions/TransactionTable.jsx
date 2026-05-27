import { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import TransactionForm from './TransactionForm';
import { IconEdit, IconTrash } from '../Icons';
import styles from './Transactions.module.css';

const fmt     = (n) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function TransactionTable({ onAdd }) {
  const { transactions, loading, deleteTransaction } = useTransactions();
  const [editTarget, setEditTarget] = useState(null);
  const [deleting,   setDeleting]   = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    setDeleting(id);
    try { await deleteTransaction(id); }
    finally { setDeleting(null); }
  };

  if (loading) {
    return (
      <div className={styles.tableLoader}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      {editTarget && (
        <TransactionForm editTarget={editTarget} onClose={() => setEditTarget(null)} />
      )}

      <div className={`glass-card ${styles.tableWrap}`}>
        {transactions.length === 0 ? (
          <div className="empty-state">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <line x1="9"  y1="12" x2="15" y2="12" />
              <line x1="9"  y1="16" x2="12" y2="16" />
            </svg>
            <p>No transactions found</p>
            <button className="btn btn-primary btn-sm" onClick={onAdd}>
              Add your first transaction
            </button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className={styles.row}>
                  <td className={styles.date}>{fmtDate(t.date)}</td>
                  <td className={styles.desc}>{t.description || <span className={styles.noDesc}>,</span>}</td>
                  <td>
                    <span className={styles.category}>{t.category}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${t.type}`}>{t.type}</span>
                  </td>
                  <td className={`${styles.amount} amount-${t.type}`}>
                    {t.type === 'expense' ? '−' : '+'}{fmt(t.amount)}
                  </td>
                  <td className={styles.actions}>
                    <button
                      className="btn btn-ghost btn-icon btn-sm"
                      title="Edit"
                      onClick={() => setEditTarget(t)}
                    >
                      <IconEdit />
                    </button>
                    <button
                      className="btn btn-danger btn-icon btn-sm"
                      title="Delete"
                      disabled={deleting === t.id}
                      onClick={() => handleDelete(t.id)}
                    >
                      <IconTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
