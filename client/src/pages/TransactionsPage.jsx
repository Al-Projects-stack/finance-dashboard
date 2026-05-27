import { useEffect, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionFilters from '../components/transactions/TransactionFilters';
import { IconPlus, IconChevronLeft, IconChevronRight } from '../components/Icons';
import styles from './TransactionsPage.module.css';

export default function TransactionsPage() {
  const { fetchTransactions, total, filters } = useTransactions();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchTransactions(); }, []);

  const handleFilter = (params) => fetchTransactions(params);
  const totalPages   = Math.ceil(total / (filters.limit ?? 20));
  const page         = filters.page ?? 1;
  const changePage   = (p) => fetchTransactions({ page: p });

  return (
    <div className={styles.page}>
      {showForm && <TransactionForm onClose={() => setShowForm(false)} />}

      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Transactions</h1>
          <span className={styles.countBadge}>{total} records</span>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <IconPlus width={16} height={16} />
          Add Transaction
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
            <IconChevronLeft /> Prev
          </button>
          <span className={styles.pageInfo}>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            className="btn btn-ghost btn-sm"
            disabled={page >= totalPages}
            onClick={() => changePage(page + 1)}
          >
            Next <IconChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
