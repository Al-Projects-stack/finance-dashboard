import { useEffect, useRef } from 'react';
import {
  Chart, BarController, BarElement,
  LinearScale, CategoryScale, Tooltip, Legend,
} from 'chart.js';
import styles from './Chart.module.css';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

/* Skill: Bar chart for comparison — distinct colors, sorted descending */
export default function IncomeExpenseChart({ monthly = [] }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !monthly.length) return;

    chartRef.current?.destroy();

    const data   = monthly.slice(-6);
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
            backgroundColor: 'rgba(34,197,94,0.7)',
            borderColor: '#22c55e',
            borderWidth: 1,
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Expenses',
            data: data.map((m) => m.expenses),
            backgroundColor: 'rgba(244,63,94,0.6)',
            borderColor: '#f43f5e',
            borderWidth: 1,
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: {
              color: '#94a3b8',
              font: { size: 12, family: "'IBM Plex Sans', sans-serif" },
              boxWidth: 10,
              borderRadius: 3,
              padding: 16,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(4,2,14,0.96)',
            titleColor: '#c084fc',
            bodyColor: '#f8fafc',
            borderColor: 'rgba(139,92,246,0.32)',
            borderWidth: 1,
            padding: 14,
            cornerRadius: 10,
            titleFont: { family: "'IBM Plex Sans', sans-serif", weight: '600', size: 12 },
            bodyFont:  { family: "'IBM Plex Sans', sans-serif", size: 13 },
            callbacks: { label: (ctx) => ` ${ctx.dataset.label}: R${ctx.raw.toLocaleString('en-ZA')}` },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748b', font: { size: 11, family: "'IBM Plex Sans', sans-serif" } },
            border: { color: 'transparent' },
          },
          y: {
            grid: { color: 'rgba(139,92,246,0.06)' },
            ticks: {
              color: '#64748b',
              font: { size: 11, family: "'IBM Plex Sans', sans-serif" },
              callback: (v) => `R${(v / 1000).toFixed(0)}k`,
            },
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
        {monthly.length
          ? <canvas ref={canvasRef} />
          : <p className={styles.noData}>No data yet</p>}
      </div>
    </div>
  );
}
