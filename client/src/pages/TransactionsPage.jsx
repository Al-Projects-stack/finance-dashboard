import { useEffect, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionFilters from '../components/transactions/TransactionFilters';
import styles from './TransactionsPage.module.css';

export default function TransactionsPage() {
  const { fetchTransactions, total, filters } = useTransactions();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchTransactions(); }, []);

  const handleFilter = (params) => fetchTransactions(params);

  const totalPages = Math.ceil(total / (filters.limit ?? 20));
  const page       = filters.page ?? 1;

  const changePage = (p) => fetchTransactions({ page: p });

  return (
    <div className={styles.page}>
      {showForm && <TransactionForm onClose={() => setShowForm(false)} />}

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Transactions</h1>
          <span className={styles.count}>{total} total</span>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Transaction
        </button>
      </div>

      <TransactionFilters onFilter={handleFilter} />

      <TransactionTable onAdd={() => setShowForm(true)} />

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className="btn btn-ghost btn-sm"
            disabled={page === 1}
            onClick={() => changePage(page - 1)}
          >
            ← Prev
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            className="btn btn-ghost btn-sm"
            disabled={page >= totalPages}
            onClick={() => changePage(page + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
