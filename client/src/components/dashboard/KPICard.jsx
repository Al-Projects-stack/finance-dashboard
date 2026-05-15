import styles from './KPICard.module.css';

const fmt = (n) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(n);

export default function KPICard({ title, value, icon, color = 'purple', format = 'currency', trend }) {
  const display = format === 'currency'    ? fmt(value)
                : format === 'percent'    ? `${value}%`
                : value;

  return (
    <div className={`${styles.card} glass-card ${styles[color]}`}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className={styles.value}>{display}</div>
      {trend != null && (
        <div className={`${styles.trend} ${trend >= 0 ? styles.up : styles.down}`}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)}% vs last month
        </div>
      )}
    </div>
  );
}
