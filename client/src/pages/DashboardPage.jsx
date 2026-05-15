import { useEffect, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import KPICard from '../components/dashboard/KPICard';
import CashFlowChart from '../components/dashboard/CashFlowChart';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import ExpenseCategoryChart from '../components/dashboard/ExpenseCategoryChart';
import styles from './DashboardPage.module.css';

const WalletIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
);

const TrendUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const TrendDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/>
    <polyline points="16 17 22 17 22 11"/>
  </svg>
);

const PiggyBankIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/>
    <path d="M2 9v1a2 2 0 0 0 2 2h1"/>
    <path d="M16 11h.01"/>
  </svg>
);

export default function DashboardPage() {
  const { summary, fetchSummary } = useTransactions();
  const [loading, setLoading] = useState(!summary);

  useEffect(() => {
    fetchSummary().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.loader}>
        <div className="spinner" />
      </div>
    );
  }

  const s = summary?.summary ?? {};
  const monthly = summary?.monthly ?? [];
  const categories = summary?.categories ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <span className={styles.subtitle}>Your financial overview</span>
      </div>

      <div className={styles.kpiGrid}>
        <KPICard
          title="Total Balance"
          value={s.balance ?? 0}
          icon={<WalletIcon />}
          color="purple"
          format="currency"
        />
        <KPICard
          title="Total Income"
          value={s.total_income ?? 0}
          icon={<TrendUpIcon />}
          color="green"
          format="currency"
        />
        <KPICard
          title="Total Expenses"
          value={s.total_expenses ?? 0}
          icon={<TrendDownIcon />}
          color="red"
          format="currency"
        />
        <KPICard
          title="Savings Rate"
          value={s.savings_rate ?? 0}
          icon={<PiggyBankIcon />}
          color="purple"
          format="percent"
        />
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartWide}>
          <CashFlowChart monthly={monthly} />
        </div>
        <IncomeExpenseChart monthly={monthly} />
      </div>

      <div className={styles.chartSingle}>
        <ExpenseCategoryChart categories={categories} />
      </div>
    </div>
  );
}
