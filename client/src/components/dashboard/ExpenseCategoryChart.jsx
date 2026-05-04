import { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from './Chart.module.css';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const PALETTE = [
  '#8b5cf6','#a855f7','#c084fc','#e879f9',
  '#818cf8','#60a5fa','#34d399','#fbbf24',
  '#f87171','#fb923c',
];

export default function ExpenseCategoryChart({ categories = [] }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !categories.length) return;

    chartRef.current?.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: categories.map((c) => c.category),
        datasets: [{
          data: categories.map((c) => c.total),
          backgroundColor: PALETTE.slice(0, categories.length),
          borderColor: '#0a0a12',
          borderWidth: 3,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#94a3b8',
              font: { size: 11 },
              boxWidth: 10,
              borderRadius: 3,
              padding: 14,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(10,8,24,0.95)',
            titleColor: '#c084fc',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(139,92,246,0.35)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (ctx) => ` R${ctx.raw.toLocaleString('en-ZA')} (${((ctx.raw / ctx.chart.getDatasetMeta(0).total) * 100).toFixed(1)}%)`,
            },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [categories]);

  return (
    <div className={`glass-card ${styles.chartCard}`}>
      <h3 className="section-title">Expense Breakdown</h3>
      <div className={`${styles.chartWrap} ${styles.doughnutWrap}`}>
        {categories.length ? <canvas ref={canvasRef} /> : <p className={styles.noData}>No expenses yet</p>}
      </div>
    </div>
  );
}
