import { useEffect, useRef } from 'react';
import {
  Chart, BarController, BarElement,
  LinearScale, CategoryScale, Tooltip, Legend,
} from 'chart.js';
import styles from './Chart.module.css';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function IncomeExpenseChart({ monthly = [] }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !monthly.length) return;

    chartRef.current?.destroy();

    // Show last 6 months
    const data = monthly.slice(-6);
    const labels = data.map((m) => {
      const [y, mo] = m.month.split('-');
      return new Date(y, mo - 1).toLocaleString('en-US', { month: 'short' });
    });

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: data.map((m) => m.income),
            backgroundColor: 'rgba(16,185,129,0.75)',
            borderColor: '#10b981',
            borderWidth: 1,
            borderRadius: 6,
          },
          {
            label: 'Expenses',
            data: data.map((m) => m.expenses),
            backgroundColor: 'rgba(244,63,94,0.65)',
            borderColor: '#f43f5e',
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: { color: '#94a3b8', font: { size: 12 }, boxWidth: 12, borderRadius: 3 },
          },
          tooltip: {
            backgroundColor: 'rgba(10,8,24,0.95)',
            titleColor: '#c084fc',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(139,92,246,0.35)',
            borderWidth: 1,
            padding: 12,
            callbacks: { label: (ctx) => ` ${ctx.dataset.label}: R${ctx.raw.toLocaleString('en-ZA')}` },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748b', font: { size: 11 } },
            border: { color: 'transparent' },
          },
          y: {
            grid: { color: 'rgba(139,92,246,0.07)' },
            ticks: { color: '#64748b', font: { size: 11 }, callback: (v) => `R${(v / 1000).toFixed(0)}k` },
            border: { color: 'transparent' },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [monthly]);

  return (
    <div className={`glass-card ${styles.chartCard}`}>
      <h3 className="section-title">Income vs Expenses</h3>
      <div className={styles.chartWrap}>
        {monthly.length ? <canvas ref={canvasRef} /> : <p className={styles.noData}>No data yet</p>}
      </div>
    </div>
  );
}
