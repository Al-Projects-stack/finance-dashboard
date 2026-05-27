import { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import TransactionForm from './TransactionForm';
import { IconEdit, IconTrash } from '../Icons';
import styles from './Transactions.module.css';

const fmt     = (n) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const EmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="16" x2="12" y2="16"/>
  </svg>
);

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

      {/* Skill: overflow-x: auto wrapper for table responsive handling */}
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
                    {/* Skill: cursor-pointer on all clickable, hover feedback */}
                    <button
                      className={`btn btn-ghost btn-icon btn-sm ${styles.actionBtn}`}
                      title="Edit transaction"
                      aria-label="Edit transaction"
                      onClick={() => setEditTarget(t)}
                    >
                      <IconEdit />
                    </button>
                    <button
                      className={`btn btn-danger btn-icon btn-sm ${styles.actionBtn}`}
                      title="Delete transaction"
                      aria-label="Delete transaction"
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
