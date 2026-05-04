import { useEffect, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import KPICard from '../components/dashboard/KPICard';
import CashFlowChart from '../components/dashboard/CashFlowChart';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import ExpenseCategoryChart from '../components/dashboard/ExpenseCategoryChart';
import styles from './DashboardPage.module.css';

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

      {/* KPI Row */}
      <div className={styles.kpiGrid}>
        <KPICard
          title="Total Balance"
          value={s.balance ?? 0}
          icon="◈"
          color="purple"
          format="currency"
        />
        <KPICard
          title="Total Income"
          value={s.total_income ?? 0}
          icon="↑"
          color="green"
          format="currency"
        />
        <KPICard
          title="Total Expenses"
          value={s.total_expenses ?? 0}
          icon="↓"
          color="red"
          format="currency"
        />
        <KPICard
          title="Savings Rate"
          value={s.savings_rate ?? 0}
          icon="⬡"
          color="purple"
          format="percent"
        />
      </div>

      {/* Charts Row */}
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
