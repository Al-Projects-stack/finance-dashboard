import { useEffect, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import KPICard from '../components/dashboard/KPICard';
import CashFlowChart from '../components/dashboard/CashFlowChart';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import ExpenseCategoryChart from '../components/dashboard/ExpenseCategoryChart';
import {
  IconWallet,
  IconTrendUp,
  IconTrendDown,
  IconPercent,
} from '../components/Icons';
import styles from './DashboardPage.module.css';

/* ── Helpers ── */
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function dateLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

/* ── Page ── */
export default function DashboardPage() {
  const { summary, fetchSummary } = useTransactions();
  const { user } = useAuth();
  const [loading, setLoading] = useState(!summary);
  const firstName = user?.full_name?.split(' ')[0] ?? 'there';

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

  const s          = summary?.summary  ?? {};
  const monthly    = summary?.monthly  ?? [];
  const categories = summary?.categories ?? [];

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.greetBlock}>
          <h1 className={styles.greetText}>
            {greeting()}, {firstName}&ensp;👋
          </h1>
          <span className={styles.dateText}>{dateLabel()}</span>
        </div>

        <div className={styles.livePill}>
          <span className={styles.liveDot} />
          Live Overview
        </div>
      </div>

      {/* ── KPI grid ── */}
      <div className={styles.kpiGrid}>
        <div style={{ '--delay': '0ms' }}    className={styles.kpiItem}>
          <KPICard title="Total Balance"  value={s.balance        ?? 0} Icon={IconWallet}    color="purple" format="currency" />
        </div>
        <div style={{ '--delay': '60ms' }}   className={styles.kpiItem}>
          <KPICard title="Total Income"   value={s.total_income   ?? 0} Icon={IconTrendUp}   color="green"  format="currency" />
        </div>
        <div style={{ '--delay': '120ms' }}  className={styles.kpiItem}>
          <KPICard title="Total Expenses" value={s.total_expenses ?? 0} Icon={IconTrendDown}  color="red"    format="currency" />
        </div>
        <div style={{ '--delay': '180ms' }}  className={styles.kpiItem}>
          <KPICard title="Savings Rate"   value={s.savings_rate   ?? 0} Icon={IconPercent}   color="cyan"   format="percent"  />
        </div>
      </div>

      {/* ── Charts row ── */}
      <div className={styles.chartsRow}>
        <div className={styles.chartWide}>
          <CashFlowChart monthly={monthly} />
        </div>
        <IncomeExpenseChart monthly={monthly} />
      </div>

      {/* ── Breakdown ── */}
      <div className={styles.chartSingle}>
        <ExpenseCategoryChart categories={categories} />
      </div>
    </div>
  );
}
